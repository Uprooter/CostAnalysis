package de.mischa.readin;

import java.util.Date;

import lombok.Data;

@Data
public class CostImportEntry {
	private Date date;
	private String recipient;
	private String purpose;
	private double amount;

	@Override
	public String toString() {
		return this.getDate() + " " + this.getRecipient() + " " + this.getPurpose() + " " + this.getAmount();
	}

	public CostImportEntry(Date date, String recipient, String purpose, double amount) {
		this.date = date;
		this.recipient = recipient;
		this.purpose = purpose;
		this.amount = amount;
	}
}
