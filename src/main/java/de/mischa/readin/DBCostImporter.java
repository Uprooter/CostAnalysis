package de.mischa.readin;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.lang3.StringUtils;

public class DBCostImporter {

	private static final int SKIP_LINES = 5;
	private static final int EXPECTED_COLUMNS = 18;
	private static final SimpleDateFormat FORMAT = new SimpleDateFormat("dd.MM.yyyy");

	public List<DBCostEntry> read(String file) throws FileNotFoundException, IOException {

		BufferedReader bufferedReader = this.readInFile(file);
		return parseContent(bufferedReader);
	}

	private List<DBCostEntry> parseContent(BufferedReader bufferedReader) throws IOException {
		List<DBCostEntry> resultList = new ArrayList<DBCostEntry>();
		CSVParser csvParser = new CSVParser(bufferedReader, CSVFormat.DEFAULT.withDelimiter(';'));
		csvParser.forEach(r -> this.parse(r, resultList));
		csvParser.close();
		return resultList;
	}

	private void parse(CSVRecord r, List<DBCostEntry> resultList) {
		if (r.size() == EXPECTED_COLUMNS) {
			Date date;
			try {
				date = FORMAT.parse(r.get(0));
			} catch (ParseException e) {
				return;
			}
			String recipient = r.get(3);
			String puropose = r.get(4);
			double amount = this.getAmount(r);
			resultList.add(new DBCostEntry(date, recipient, puropose, amount));
		}
	}

	private double getAmount(CSVRecord r) {

		String amount = (r.get(15) != null && !r.get(15).isEmpty()) ? r.get(15) : r.get(16);
		amount = StringUtils.remove(amount, '.');
		amount = amount.replace(',', '.');
		return Double.valueOf(amount);
	}

	private BufferedReader readInFile(String fileName) throws IOException {
		File file = new File(fileName);
		FileReader filereader = new FileReader(file);
		BufferedReader bufferedReader = new BufferedReader(filereader);
		this.skipLines(bufferedReader);

		return bufferedReader;
	}

	private void skipLines(BufferedReader bufferedReader) throws IOException {
		for (int i = 0; i < SKIP_LINES; i++) {
			bufferedReader.readLine();
		}
	}
}
