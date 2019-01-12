package de.mischa.readin;

import de.mischa.model.CostOwner;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class AbstractCostImporter {

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("dd.MM.yyyy", Locale.GERMAN);
    private static final Charset CODING = StandardCharsets.ISO_8859_1;
    private ImportConfig config;

    public AbstractCostImporter() {

    }

    public AbstractCostImporter(ImportConfig config) {
        this.config = config;
    }

    public List<CostImportEntry> read(String file) throws IOException {

        Reader bufferedReader = this.readInFile(file);
        return parseContent(bufferedReader);
    }

    public int calculateLinesToSkip(List<String> lines) {
        int toSkip = 0;
        for (String line : lines) {
            StringTokenizer tokenizer = new StringTokenizer(line, ";");
            if (tokenizer.countTokens() == config.getColumnNames().length) {
                return toSkip;
            }
            toSkip++;
        }

        return toSkip;
    }

    public List<CostImportEntry> read(InputStream fileStream) throws IOException {

        Reader bufferedReader = this.readInFile(fileStream);
        return parseContent(bufferedReader);
    }

    private List<CostImportEntry> parseContent(Reader bufferedReader) throws IOException {
        List<CostImportEntry> resultList = new ArrayList<>();
        CSVParser csvParser = new CSVParser(bufferedReader,
                CSVFormat.DEFAULT.withHeader(this.config.getColumnNames()).withDelimiter(';'));
        csvParser.forEach(r -> this.parse(r, resultList));
        csvParser.close();
        return resultList;
    }

    private void parse(CSVRecord r, List<CostImportEntry> resultList) {
        if (r.size() == this.config.getColumnNames().length) {
            Date date;
            try {
                date = DATE_FORMAT.parse(r.get(this.config.getDateColumnName()));
            } catch (ParseException e) {
                return;
            }
            String recipient = r.get(this.config.getRecipientColumnName());
            String purpose = r.get(this.config.getPurposeColumnName());
            double amount = this.getAmount(r);
            resultList.add(new CostImportEntry(date, recipient, purpose, amount));
        }
    }

    protected double getDoubleFromString(String string) {
        String newString = StringUtils.remove(string, '.');
        newString = newString.replace(',', '.');
        return Double.valueOf(newString);
    }

    protected double getAmount(CSVRecord r) {
        String negAmount = r.get(this.config.getNegativeAmountColumnName());
        String amount = (negAmount != null && !negAmount.isEmpty()) ? negAmount
                : r.get(this.config.getPositiveAmountColumnName());
        return this.getDoubleFromString(amount);
    }

    private Reader readInFile(String fileName) throws IOException {
        File file = new File(fileName);
        List<String> lines = FileUtils.readLines(file, CODING.name());

        lines = this.skipLines(lines);

        return new InputStreamReader(IOUtils.toInputStream(this.linesToString(lines), CODING));
    }

    private Reader readInFile(InputStream fileStream) throws IOException {

        BufferedReader reader = new BufferedReader(new InputStreamReader(fileStream));
        List<String> lines = new ArrayList<>();
        while (reader.ready()) {
            lines.add(reader.readLine());
        }

        lines = this.skipLines(lines);

        return new InputStreamReader(IOUtils.toInputStream(this.linesToString(lines), CODING));
    }

    private String linesToString(List<String> lines) {
        return lines.stream().map(Object::toString).collect(Collectors.joining("\n"));
    }

    private List<String> skipLines(List<String> lines) {
        return lines.subList(this.calculateLinesToSkip(lines), lines.size());
    }

    public CostOwner getCostOwner() {
        return CostOwner.GESA;
    }
}
