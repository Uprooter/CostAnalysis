package de.mischa.readin;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DBCostEntry {
	private Date date;
	private String recipient;
	private String purpose;
	private double amount;

	@Override
	public String toString() {
		return this.getDate() + " " + this.getRecipient() + " " + this.getPurpose() + " " + this.getAmount();
	}
}
