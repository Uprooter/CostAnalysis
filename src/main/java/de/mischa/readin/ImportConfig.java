package de.mischa.readin;

import lombok.Data;

@Data
public class ImportConfig {

	private String[] columnNames;
	private String recipientColumnName;
	private String dateColumnName;
	private String purposeColumnName;
	private String negativeAmountColumnName;
	private String positiveAmountColumnName;
	private int linesToSkip;

	public ImportConfig(String[] columnNames, String dateColumnName, String recipientColumnName,
			String purposeColumnName, String amountNegColumnName, String amountPosColumnName, int skipLines) {
		this.columnNames = columnNames;
		this.dateColumnName = dateColumnName;
		this.recipientColumnName = recipientColumnName;
		this.purposeColumnName = purposeColumnName;
		this.positiveAmountColumnName = amountPosColumnName;
		this.negativeAmountColumnName = amountNegColumnName;
		this.linesToSkip = skipLines;

	}

}
