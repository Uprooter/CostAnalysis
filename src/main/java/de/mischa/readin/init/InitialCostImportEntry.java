package de.mischa.readin.init;

import de.mischa.model.CostCluster;
import de.mischa.model.CostOwner;
import de.mischa.model.CostType;
import java.time.LocalDate;
import lombok.Data;


@Data
public class InitialCostImportEntry
{
   private LocalDate date;
   private String recipient;
   private String purpose;
   private double amount;
   private CostCluster cluster;
   private String detailedCluster;
   private CostOwner owner;
   private CostType type;

}
