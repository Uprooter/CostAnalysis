package de.mischa.readin;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import de.mischa.model.CostOwner;

@Component
public class AbstractCostImporter {

	private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("dd.MM.yyyy");
	private static final Charset CODING = StandardCharsets.ISO_8859_1;
	private ImportConfig config;

	public AbstractCostImporter() {

	}

	public AbstractCostImporter(ImportConfig config) {
		this.config = config;
	}

	public List<CostImportEntry> read(String file) throws FileNotFoundException, IOException {

		Reader bufferedReader = this.readInFile(file);
		return parseContent(bufferedReader);
	}

	public List<CostImportEntry> read(InputStream fileStream) throws FileNotFoundException, IOException {

		Reader bufferedReader = this.readInFile(fileStream);
		return parseContent(bufferedReader);
	}

	private List<CostImportEntry> parseContent(Reader bufferedReader) throws IOException {
		List<CostImportEntry> resultList = new ArrayList<CostImportEntry>();
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
			String puropose = r.get(this.config.getPurposeColumnName());
			double amount = this.getAmount(r);
			resultList.add(new CostImportEntry(date, recipient, puropose, amount));
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

		Reader fileReader = new InputStreamReader(
				IOUtils.toInputStream(this.linesToString(lines), CODING));
		return fileReader;
	}

	private Reader readInFile(InputStream fileStream) throws IOException {

		BufferedReader reader = new BufferedReader(new InputStreamReader(fileStream));
		List<String> lines = new ArrayList<String>();
		while (reader.ready()) {
			lines.add(reader.readLine());
		}

		lines = this.skipLines(lines);

		Reader fileReader = new InputStreamReader(
				IOUtils.toInputStream(this.linesToString(lines), CODING));
		return fileReader;
	}

	private String linesToString(List<String> lines) {
		return lines.stream().map(Object::toString).collect(Collectors.joining("\n"));
	}

	private List<String> skipLines(List<String> lines) throws IOException {
		return lines.subList(this.config.getLinesToSkip(), lines.size());
	}

	public CostOwner getCostOwner() {
		return CostOwner.GESA;
	}
}
