package de.mischa.readin;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
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

@Component
public class DBCostImporter {

	private static final String DATE_COLUMN_NAME = "Buchungstag";
	private static final String RECIPIENT_COLUMN_NAME = "Begünstigter / Auftraggeber";
	private static final String PURPOSE_COLUMN_NAME = "Verwendungszweck";
	private static final String AMOUNT_NEG_COLUMN_NAME = "Soll";
	private static final String AMOUNT_POS_COLUMN_NAME = "Haben";
	private static final String[] COLUMN_NAMES = { DATE_COLUMN_NAME, "Wert", "Umsatzart", RECIPIENT_COLUMN_NAME,
			PURPOSE_COLUMN_NAME, "IBAN", "BIC", "Kundenreferenz", "Mandatsreferenz", "Gläubiger ID", "Fremde Gebühren",
			"Betrag", "Abweichender Empfänger", "Anzahl der Aufträge", "Anzahl der Schecks", AMOUNT_NEG_COLUMN_NAME,
			AMOUNT_POS_COLUMN_NAME, "Währung" };
	private static final int SKIP_LINES = 4;
	private static final int EXPECTED_COLUMNS = 18;
	private static final SimpleDateFormat FORMAT = new SimpleDateFormat("dd.MM.yyyy");

	public List<DBCostEntry> read(String file) throws FileNotFoundException, IOException {

		Reader bufferedReader = this.readInFile(file);
		return parseContent(bufferedReader);
	}

	private List<DBCostEntry> parseContent(Reader bufferedReader) throws IOException {
		List<DBCostEntry> resultList = new ArrayList<DBCostEntry>();
		CSVParser csvParser = new CSVParser(bufferedReader,
				CSVFormat.DEFAULT.withHeader(COLUMN_NAMES).withDelimiter(';'));
		csvParser.forEach(r -> this.parse(r, resultList));
		csvParser.close();
		return resultList;
	}

	private void parse(CSVRecord r, List<DBCostEntry> resultList) {
		if (r.size() == EXPECTED_COLUMNS) {
			Date date;
			try {
				date = FORMAT.parse(r.get(DATE_COLUMN_NAME));
			} catch (ParseException e) {
				return;
			}
			String recipient = r.get(RECIPIENT_COLUMN_NAME);
			String puropose = r.get(PURPOSE_COLUMN_NAME);
			double amount = this.getAmount(r);
			resultList.add(new DBCostEntry(date, recipient, puropose, amount));
		}
	}

	private double getAmount(CSVRecord r) {

		String negAmount = r.get(AMOUNT_NEG_COLUMN_NAME);
		String amount = (negAmount != null && !negAmount.isEmpty()) ? negAmount : r.get(AMOUNT_POS_COLUMN_NAME);
		amount = StringUtils.remove(amount, '.');
		amount = amount.replace(',', '.');
		return Double.valueOf(amount);
	}

	private Reader readInFile(String fileName) throws IOException {
		File file = new File(fileName);
		List<String> lines = FileUtils.readLines(file, StandardCharsets.UTF_8.name());

		lines = this.skipLines(lines);

		Reader fileReader = new InputStreamReader(
				IOUtils.toInputStream(this.linesToString(lines), StandardCharsets.UTF_8));
		return fileReader;
	}

	private String linesToString(List<String> lines) {
		return lines.stream().map(Object::toString).collect(Collectors.joining("\n"));
	}

	private List<String> skipLines(List<String> lines) throws IOException {
		return lines.subList(SKIP_LINES, (lines.size() - 1));
	}
}
