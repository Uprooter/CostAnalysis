package de.mischa.calc;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.mischa.model.AverageCostModel;
import de.mischa.model.CostCluster;
import de.mischa.model.CostItem;
import de.mischa.model.CostOwner;
import de.mischa.model.CostType;
import de.mischa.repository.CostItemRepository;

@Service
public class AverageCostsCalculationService {

	private static final Logger logger = LoggerFactory.getLogger(AverageCostsCalculationService.class);

	@Autowired
	private CostItemRepository costItemRep;

	public AverageCostModel calculate(Date from, Date to, boolean includeOthers) {

		List<CostItem> relevantItems = this.costItemRep.findRelevant(from, to);
		if (!includeOthers) {
			return this.calculateResult(
					relevantItems.stream().filter(i -> i.getDetailedCluster().getCluster() != CostCluster.SONSTIGES)
							.collect(Collectors.toList()));
		}

		return calculateResult(relevantItems);
	}

	AverageCostModel calculateResult(List<CostItem> relevantItems) {
		AverageCostModel result = new AverageCostModel();
		result.setFixedCostsMischa(this.calculateMonthlyCostAverage(relevantItems, CostOwner.MISCHA, CostType.FEST));
		result.setFixedCostsGesa(this.calculateMonthlyCostAverage(relevantItems, CostOwner.GESA, CostType.FEST));
		result.setTotalAverageFixedCosts(result.getFixedCostsGesa() + result.getFixedCostsMischa());

		result.setFlexCostsMischa(this.calculateMonthlyCostAverage(relevantItems, CostOwner.MISCHA, CostType.FLEXIBEL));
		result.setFlexCostsGesa(this.calculateMonthlyCostAverage(relevantItems, CostOwner.GESA, CostType.FLEXIBEL));
		result.setTotalAverageFlexCosts(result.getFlexCostsGesa() + result.getFlexCostsMischa());

		result.setTotalAverageMischa(result.getFixedCostsMischa() + result.getFlexCostsMischa());
		result.setTotalAverageGesa(result.getFixedCostsGesa() + result.getFlexCostsGesa());

		result.setTotalCosts(this.calculateMonthlyCostAverage(relevantItems, null, null));

		result.setAverageSavingsMischa(calculateMonthlySavingsAverage(relevantItems, CostOwner.MISCHA));
		result.setAverageSavingsGesa(calculateMonthlySavingsAverage(relevantItems, CostOwner.GESA));
		result.setTotalAverageSavings(result.getAverageSavingsGesa() + result.getAverageSavingsMischa());

		result.setAbsoluteDiffMischa(this.calculateAbsoluteDiff(relevantItems, CostOwner.MISCHA));
		result.setAbsoluteDiffGesa(this.calculateAbsoluteDiff(relevantItems, CostOwner.GESA));
		result.setAbsoluteTotalDiff(result.getAbsoluteDiffGesa() + result.getAbsoluteDiffMischa());
		return result;
	}

	private double calculateAbsoluteDiff(List<CostItem> relevantItems, CostOwner owner) {
		double costs = this.getCostItems(relevantItems, owner).stream().mapToDouble(i -> i.getAmount()).sum();
		double earnings = getEarningItems(relevantItems, owner).stream().mapToDouble(i -> i.getAmount()).sum();

		return earnings + costs;
	}

	private List<CostItem> getEarningItems(List<CostItem> relevantItems, CostOwner owner) {
		return relevantItems.stream()//
				.filter(i -> i.getOwner() == owner)//
				.filter(i -> i.getType() == CostType.GEHALT).collect(Collectors.toList());
	}

	private List<CostItem> getCostItems(List<CostItem> relevantItems, CostOwner owner) {
		return relevantItems.stream()//
				.filter(i -> owner == null || i.getOwner() == owner)//
				.filter(i -> i.getType() != CostType.GEHALT)//
				.collect(Collectors.toList());
	}

	double calculateMonthlySavingsAverage(List<CostItem> relevantItems, CostOwner owner) {
		List<CostItem> ownerItems = relevantItems.stream().filter(i -> i.getOwner() == owner)
				.collect(Collectors.toList());

		Map<String, Double> monthlySums = getMonthlySums(ownerItems);
		return monthlySums.entrySet().stream().mapToDouble(e -> e.getValue()).average().orElse(0);
	}

	double calculateMonthlyCostAverage(List<CostItem> relevantItems, CostOwner owner, CostType type) {		
		List<CostItem> costTypeItems = this.getCostItems(relevantItems, owner)//
				.stream().filter(i -> type == null || i.getType() == type)//
				.collect(Collectors.toList());
		
		Map<String, Double> monthlySums = getMonthlySums(costTypeItems);
//		 monthlySums.entrySet().stream().forEach(e -> logger.info(e.getKey() + " " +
//		 e.getValue()));
		return monthlySums.entrySet().stream().mapToDouble(e -> e.getValue()).average().orElse(0);
	}

	Map<String, Double> getMonthlySums(List<CostItem> costTypeItems) {
		Map<String, Double> monthlySums = new HashMap<>();
		for (CostItem item : costTypeItems) {
			LocalDate localDate = item.getCreationDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
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
