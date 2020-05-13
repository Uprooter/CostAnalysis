package de.mischa.readin;

import java.time.LocalDate;
import lombok.Data;


@Data
public class CostImportEntry
{
   private LocalDate date;
   private String recipient;
   private String purpose;
   private double amount;

   @Override
   public String toString()
   {
      return this.getDate() + " " + this.getRecipient() + " " + this.getPurpose() + " " + this.getAmount();
   }

   public CostImportEntry(LocalDate date, String recipient, String purpose, double amount)
   {
      this.date = date;
      this.recipient = recipient;
      this.purpose = purpose;
      this.amount = amount;
   }
}
