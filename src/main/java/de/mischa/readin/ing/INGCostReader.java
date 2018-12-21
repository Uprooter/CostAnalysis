package de.mischa.readin.ing;

import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Component;

import de.mischa.model.CostOwner;
import de.mischa.readin.AbstractCostImporter;
import de.mischa.readin.ImportConfig;

@Component
public class INGCostReader extends AbstractCostImporter {

	private static final String DATE_COLUMN_NAME = "Buchung";
	private static final String RECIPIENT_COLUMN_NAME = "Auftraggeber/Empfänger";
	private static final String PURPOSE_COLUMN_NAME = "Verwendungszweck";
	private static final String AMOUNT_NEG_COLUMN_NAME = "Betrag";
	private static final String[] COLUMN_NAMES = { DATE_COLUMN_NAME, "Valuta", RECIPIENT_COLUMN_NAME, "Buchungstext",
			PURPOSE_COLUMN_NAME, AMOUNT_NEG_COLUMN_NAME, "Währung" };
	private static final int SKIP_LINES = 11;

	public INGCostReader() {
		super(new ImportConfig(COLUMN_NAMES, DATE_COLUMN_NAME, RECIPIENT_COLUMN_NAME, PURPOSE_COLUMN_NAME,
				AMOUNT_NEG_COLUMN_NAME, "None", SKIP_LINES));
	}

	protected double getAmount(CSVRecord r) {
		return this.getDoubleFromString(r.get(AMOUNT_NEG_COLUMN_NAME));
	}

	@Override
	public CostOwner getCostOwner() {
		return CostOwner.MISCHA;
	}
}
