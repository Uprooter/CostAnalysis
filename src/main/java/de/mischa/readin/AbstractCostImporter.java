package de.mischa.readin;

import de.mischa.model.CostOwner;
import de.mischa.utils.DateUtils;
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
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Component
public class AbstractCostImporter {
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


    public List<CostImportEntry> read(InputStream fileStream) throws IOException {

        Reader bufferedReader = this.readInFile(fileStream);
        return parseContent(bufferedReader);
    }

    private List<CostImportEntry> parseContent(Reader bufferedReader) throws IOException {
        List<CostImportEntry> resultList = new ArrayList<>();
        CSVParser csvParser = new CSVParser(bufferedReader,
                CSVFormat.DEFAULT.withHeader(this.config.getColumnNames()).withDelimiter(';').withFirstRecordAsHeader());
        csvParser.forEach(r -> this.parse(r, resultList));
        csvParser.close();
        return resultList;
    }

    private void parse(CSVRecord r, List<CostImportEntry> resultList) {
        boolean validRecord = r.size() == this.config.getColumnNames().length;
        if (validRecord) {
            LocalDate date;
            try {
                date = DateUtils.createDate(r.get(this.config.getDateColumnName()));
            } catch (DateTimeParseException e) {
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
        return Double.parseDouble(newString);
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
        int skipLinesAtBeginning = this.calculateLinesToSkipFromBeginning(lines);
        //Do not want to evaluate the header here -> +1
        int skipLinesAtEnd = this.calculateLinesToSkipAtEnd(lines.subList(skipLinesAtBeginning + 1, lines.size()));
        if (skipLinesAtBeginning > 0) {
            return lines.subList(skipLinesAtBeginning - 1, lines.size() - skipLinesAtEnd);
        } else {
            return lines.subList(0, lines.size() - skipLinesAtEnd);
        }
    }

    public int calculateLinesToSkipFromBeginning(List<String> lines) {
        int toSkip = 0;
        for (String line : lines) {
            String[] tokens = line.split(";", -1);
            boolean hasExpectedNumberOfValues = tokens.length == config.getColumnNames().length;
            boolean hasExpectedFirstValue = DateUtils.isDate(tokens[0]);
            if (!hasExpectedNumberOfValues || !hasExpectedFirstValue) {
                toSkip++;
            } else {
                // Found first valid -> return
                return toSkip;
            }
        }

        return toSkip;
    }


    public int calculateLinesToSkipAtEnd(List<String> lines) {
        int toSkip = 0;
        for (String line : lines) {
            String[] tokens = line.split(";", -1);
            boolean hasExpectedNumberOfValues = tokens.length == config.getColumnNames().length;
            boolean hasExpectedFirstValue = DateUtils.isDate(tokens[0]); // has to be a date
            if (!hasExpectedNumberOfValues || !hasExpectedFirstValue) {
                toSkip++;
            }
        }

        return toSkip;
    }


    public CostOwner getCostOwner() {
        return CostOwner.GESA;
    }
}
