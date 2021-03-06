package de.mischa.readin.db;

import de.mischa.model.CostOwner;
import de.mischa.readin.AbstractCostImporter;
import de.mischa.readin.ImportConfig;
import org.springframework.stereotype.Component;

@Component
public class DBCostReader extends AbstractCostImporter {

    private static final String DATE_COLUMN_NAME = "Buchungstag";
    private static final String RECIPIENT_COLUMN_NAME = "Begünstigter / Auftraggeber";
    private static final String PURPOSE_COLUMN_NAME = "Verwendungszweck";
    private static final String AMOUNT_NEG_COLUMN_NAME = "Soll";
    private static final String AMOUNT_POS_COLUMN_NAME = "Haben";
    private static final String[] COLUMN_NAMES = {DATE_COLUMN_NAME, "Wert", "Umsatzart", RECIPIENT_COLUMN_NAME,
            PURPOSE_COLUMN_NAME, "IBAN", "BIC", "Kundenreferenz", "Mandatsreferenz", "Gläubiger ID", "Fremde Gebühren",
            "Betrag", "Abweichender Empfänger", "Anzahl der Aufträge", "Anzahl der Schecks", AMOUNT_NEG_COLUMN_NAME,
            AMOUNT_POS_COLUMN_NAME, "FX"};

    public DBCostReader() {
        super(new ImportConfig(COLUMN_NAMES, DATE_COLUMN_NAME, RECIPIENT_COLUMN_NAME, PURPOSE_COLUMN_NAME,
                AMOUNT_NEG_COLUMN_NAME, AMOUNT_POS_COLUMN_NAME));
    }

    @Override
    public CostOwner getCostOwner() {
        return CostOwner.GESA;
    }
}
