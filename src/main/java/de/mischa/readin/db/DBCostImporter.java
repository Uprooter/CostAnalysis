package de.mischa.readin.db;

import org.springframework.stereotype.Component;

import de.mischa.model.CostOwner;
import de.mischa.readin.AbstractCostImporter;
import de.mischa.readin.ImportConfig;

@Component
public class DBCostImporter extends AbstractCostImporter {

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

	public DBCostImporter() {
		super(new ImportConfig(COLUMN_NAMES, DATE_COLUMN_NAME, RECIPIENT_COLUMN_NAME, PURPOSE_COLUMN_NAME,
				AMOUNT_NEG_COLUMN_NAME, AMOUNT_POS_COLUMN_NAME, SKIP_LINES));
	}
	
	@Override
	public CostOwner getCostOwner() {
		return CostOwner.GESA;
	}
}
