package de.mischa.readin.init;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import de.mischa.model.CostCluster;
import de.mischa.model.CostOwner;
import de.mischa.model.CostType;

@Component
public class InitialCostReader {

	private static final String DATE_COLUMN_NAME = "Buchungstag";
	private static final String RECIPIENT_COLUMN_NAME = "Beguenstigter/Zahlungspflichtiger";
	private static final String PURPOSE_COLUMN_NAME = "Verwendungszweck";
	private static final String AMOUNT_NEG_COLUMN_NAME = "Betrag";
	private static final String OWNER_COLUMN_NAME = "Wer";
	private static final String DETAILED_CLUSTER_COLUMN_ANME = "Typ Detail";
	private static final String CLUSTER_COLUMN_NAME = "Typ";
	private static final String TYPE_COLUMN_NAME = "Kostenart";
	private static final String[] COLUMN_NAMES = { DATE_COLUMN_NAME, RECIPIENT_COLUMN_NAME, PURPOSE_COLUMN_NAME,
			AMOUNT_NEG_COLUMN_NAME, CLUSTER_COLUMN_NAME, DETAILED_CLUSTER_COLUMN_ANME, OWNER_COLUMN_NAME,
			TYPE_COLUMN_NAME };
	private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("dd.MM.yyyy");

	public List<InitialCostImportEntry> read(String file) throws FileNotFoundException, IOException {
		Reader bufferedReader = this.readInFile(file);
		return parseContent(bufferedReader);
	}

	private List<InitialCostImportEntry> parseContent(Reader bufferedReader) throws IOException {
		List<InitialCostImportEntry> resultList = new ArrayList<InitialCostImportEntry>();
		CSVParser csvParser = new CSVParser(bufferedReader,
				CSVFormat.DEFAULT.withHeader(COLUMN_NAMES).withDelimiter(';'));
		csvParser.forEach(r -> this.parse(r, resultList));
		csvParser.close();
		return resultList;
	}

	private void parse(CSVRecord r, List<InitialCostImportEntry> resultList) {
		if (r.size() == COLUMN_NAMES.length) {
			InitialCostImportEntry entry = new InitialCostImportEntry();

			try {
				entry.setDate(DATE_FORMAT.parse(r.get(DATE_COLUMN_NAME)));
			} catch (ParseException e) {
				return;
			}
			entry.setRecipient(r.get(RECIPIENT_COLUMN_NAME));
			entry.setPurpose(r.get(PURPOSE_COLUMN_NAME));
			entry.setAmount(this.getAmount(r));
			entry.setOwner(CostOwner.valueOf(r.get(OWNER_COLUMN_NAME).toUpperCase()));
			entry.setCluster(this.getCluster(r.get(CLUSTER_COLUMN_NAME)));
			entry.setDetailedClustes(r.get(DETAILED_CLUSTER_COLUMN_ANME));
			entry.setType(CostType.valueOf(r.get(TYPE_COLUMN_NAME).toUpperCase()));
			resultList.add(entry);
		}
	}

	private CostCluster getCluster(String clusterName) {
		if (clusterName.equals("HW Möbel")) {
			return CostCluster.HW_MOEBEL;
		}
		return CostCluster.valueOf(clusterName.toUpperCase());
	}

	protected double getDoubleFromString(String string) {
		String newString = StringUtils.remove(string, '.');
		newString = newString.replace(',', '.');
		return Double.valueOf(newString);
	}

	protected double getAmount(CSVRecord r) {
		return this.getDoubleFromString(r.get(AMOUNT_NEG_COLUMN_NAME));
	}

	private Reader readInFile(String fileName) throws IOException {
		File file = new File(fileName);
		List<String> lines = FileUtils.readLines(file, StandardCharsets.UTF_8.name());

		Reader fileReader = new InputStreamReader(
				IOUtils.toInputStream(this.linesToString(lines), StandardCharsets.UTF_8));
		return fileReader;
	}

	private String linesToString(List<String> lines) {
		return lines.stream().map(Object::toString).collect(Collectors.joining("\n"));
	}

}
