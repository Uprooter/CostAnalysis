package de.mischa.readin.init;

import java.util.Date;

import de.mischa.model.CostCluster;
import de.mischa.model.CostOwner;
import de.mischa.model.CostType;
import lombok.Data;

@Data
public class InitialCostImportEntry {
	private Date date;
	private String recipient;
	private String purpose;
	private double amount;
	private CostCluster cluster;
	private String detailedCluster;
	private CostOwner owner;
	private CostType type;

}
