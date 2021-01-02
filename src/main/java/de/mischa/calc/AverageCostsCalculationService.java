package de.mischa.calc;

import de.mischa.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class AverageCostsCalculationService {
    public AverageCostModel calculate(List<CostItem> relevantItems, boolean includeOthers, boolean savingsAreCosts) {
        List<CostItem> withoutUmbuchung = relevantItems.stream()
                .filter(i -> i.getDetailedCluster().getCluster() != CostCluster.UMBUCHUNG).collect(Collectors.toList());

        if (!includeOthers) {
            return this.calculateResult(
                    withoutUmbuchung.stream()
                            .filter(i -> i.getDetailedCluster().getCluster() != CostCluster.SONSTIGE_AUSGABEN)
                            .filter(i -> i.getDetailedCluster().getCluster() != CostCluster.SONSTIGE_EINNAHMEN)
                            .collect(Collectors.toList()), savingsAreCosts);
        }

        return calculateResult(withoutUmbuchung, savingsAreCosts);
    }

    AverageCostModel calculateResult(List<CostItem> relevantItems, boolean savingsAreCosts) {
        AverageCostModel result = new AverageCostModel();
        result.setFixedCostsMischa(this.calculateMonthlyCostAverage(relevantItems, CostOwner.MISCHA, CostType.FEST, savingsAreCosts));
        result.setFixedCostsGesa(this.calculateMonthlyCostAverage(relevantItems, CostOwner.GESA, CostType.FEST, savingsAreCosts));
        result.setTotalAverageFixedCosts(result.getFixedCostsGesa() + result.getFixedCostsMischa());

        result.setFlexCostsMischa(
                this.calculateMonthlyCostAverage(relevantItems, CostOwner.MISCHA, CostType.FLEXIBEL, savingsAreCosts));
        result.setFlexCostsGesa(this.calculateMonthlyCostAverage(relevantItems, CostOwner.GESA, CostType.FLEXIBEL, savingsAreCosts));
        result.setTotalAverageFlexCosts(result.getFlexCostsGesa() + result.getFlexCostsMischa());

        result.setTotalAverageMischa(result.getFixedCostsMischa() + result.getFlexCostsMischa());
        result.setTotalAverageGesa(result.getFixedCostsGesa() + result.getFlexCostsGesa());

        result.setTotalCosts(this.calculateMonthlyCostAverage(relevantItems, null, null, savingsAreCosts));

        result.setAverageSavingsMischa(calculateMonthlySavingsAverage(relevantItems, CostOwner.MISCHA, savingsAreCosts));
        result.setAverageSavingsGesa(calculateMonthlySavingsAverage(relevantItems, CostOwner.GESA, savingsAreCosts));
        result.setTotalAverageSavings(result.getAverageSavingsGesa() + result.getAverageSavingsMischa());

        result.setAbsoluteDiffMischa(this.calculateAbsoluteDiff(relevantItems, CostOwner.MISCHA, savingsAreCosts));
        result.setAbsoluteDiffGesa(this.calculateAbsoluteDiff(relevantItems, CostOwner.GESA, savingsAreCosts));
        result.setAbsoluteTotalDiff(result.getAbsoluteDiffGesa() + result.getAbsoluteDiffMischa());
        return result;
    }

    private double calculateAbsoluteDiff(List<CostItem> relevantItems, CostOwner owner, boolean savingsAreCosts) {
        double costs = this.getCostItems(relevantItems, owner, savingsAreCosts).stream().mapToDouble(CostItem::getAmount).sum();
        double earnings = getEarningItems(relevantItems, owner).stream().mapToDouble(CostItem::getAmount).sum();

        return earnings + costs;
    }

    private List<CostItem> getEarningItems(List<CostItem> relevantItems, CostOwner owner) {
        return relevantItems.stream()//
                .filter(i -> i.getOwner() == owner)//
                .filter(i -> i.getType() == CostType.GEHALT).collect(Collectors.toList());
    }

    private List<CostItem> getCostItems(List<CostItem> relevantItems, CostOwner owner, boolean savingsAreCosts) {
        return relevantItems.stream()//
                .filter(i -> owner == null || i.getOwner() == owner)//
                .filter(i -> i.getType() != CostType.GEHALT)//
                .filter(i -> (!this.isAccessibleSaving(i) || (this.isAccessibleSaving(i) && savingsAreCosts)))
                .collect(Collectors.toList());
    }

    private boolean isAccessibleSaving(CostItem item) {
        return item.getDetailedCluster().getCluster() == CostCluster.SPAREN
                && item.getDetailedCluster().getName().equals(DetailedCostCluster.DAUERAUFTRAG);
    }

    private double calculateMonthlySavingsAverage(List<CostItem> relevantItems, CostOwner owner, boolean savingsAreCosts) {
        List<CostItem> ownerItems = relevantItems.stream().filter(i -> i.getOwner() == owner)
                .collect(Collectors.toList());

        //switch savings cost to positive amount
        for (CostItem item : relevantItems) {
            if (!savingsAreCosts && this.isAccessibleSaving(item)) {
                item.setAmount(item.getAmount() * -1.0);
            }
        }

        Map<String, Double> monthlySums = getMonthlySums(ownerItems);
        return monthlySums.values().stream().mapToDouble(v -> v).average().orElse(0);
    }

    double calculateMonthlyCostAverage(List<CostItem> relevantItems, CostOwner owner,
                                       CostType type, boolean savingsAreCosts) {
        List<CostItem> costTypeItems = this.getCostItems(relevantItems, owner, savingsAreCosts)//
                .stream().filter(i -> type == null || i.getType() == type)//
                .collect(Collectors.toList());

        Map<String, Double> monthlySums = getMonthlySums(costTypeItems);
        //		 monthlySums.entrySet().stream().forEach(e -> logger.info(e.getKey() + " " +
        //		 e.getValue()));
        return monthlySums.entrySet().stream().mapToDouble(Map.Entry::getValue).average().orElse(0);
    }

    Map<String, Double> getMonthlySums(List<CostItem> costTypeItems) {
        Map<String, Double> monthlySums = new HashMap<>();
        for (CostItem item : costTypeItems) {
            LocalDate localDate = item.getCreationDate();
            int year = localDate.getYear();
            int month = localDate.getMonthValue();
            String monthYear = month + "" + year;

            if (monthlySums.containsKey(monthYear)) {
                Double oldValue = monthlySums.get(monthYear);
                monthlySums.put(monthYear, oldValue + item.getAmount());
            } else {
                monthlySums.put(monthYear, item.getAmount());
            }
        }
        return monthlySums;
    }

}
