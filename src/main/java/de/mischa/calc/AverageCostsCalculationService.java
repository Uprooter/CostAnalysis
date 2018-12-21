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
		result.setFixedCostsMischa(this.calculateMonthlyAverage(relevantItems, CostOwner.MISCHA, CostType.FEST));
		result.setFixedCostsGesa(this.calculateMonthlyAverage(relevantItems, CostOwner.GESA, CostType.FEST));
		result.setTotalAverageFixedCosts(result.getFixedCostsGesa() + result.getFixedCostsMischa());

		result.setFlexCostsMischa(this.calculateMonthlyAverage(relevantItems, CostOwner.MISCHA, CostType.FLEXIBEL));
		result.setFlexCostsGesa(this.calculateMonthlyAverage(relevantItems, CostOwner.GESA, CostType.FLEXIBEL));
		result.setTotalAverageFlexCosts(result.getFlexCostsGesa() + result.getFlexCostsMischa());

		result.setTotalAverageMischa(result.getFixedCostsMischa() + result.getFlexCostsMischa());
		result.setTotalAverageGesa(result.getFixedCostsGesa() + result.getFlexCostsGesa());

		result.setDiffMischa(this.calculateDiff(relevantItems, CostOwner.MISCHA));
		result.setDiffGesa(this.calculateDiff(relevantItems, CostOwner.GESA));
		result.setTotalDiff(result.getDiffGesa() + result.getDiffMischa());
		return result;
	}

	private double calculateDiff(List<CostItem> relevantItems, CostOwner owner) {
		double costs = this.getCostsOnly(relevantItems, owner).stream().mapToDouble(i -> i.getAmount()).sum();

		double earnings = relevantItems.stream()//
				.filter(i -> i.getOwner() == owner)//
				.filter(i -> i.getType() == CostType.GEHALT)//
				.mapToDouble(i -> i.getAmount()).sum();
		return earnings + costs;
	}

	private List<CostItem> getCostsOnly(List<CostItem> relevantItems, CostOwner owner) {
		return relevantItems.stream()//
				.filter(i -> i.getOwner() == owner)//
				.filter(i -> i.getType() != CostType.GEHALT)//
				.collect(Collectors.toList());
	}

	double calculateMonthlyAverage(List<CostItem> relevantItems, CostOwner owner, CostType type) {
		List<CostItem> costTypeItems = this.getCostsOnly(relevantItems, owner)//
				.stream().filter(i -> i.getType() == type)//
				.collect(Collectors.toList());

		Map<String, Double> monthlySums = getMonthlySums(costTypeItems);
		// monthlySums.entrySet().stream().forEach(e -> logger.info(e.getKey() + " " +
		// e.getValue()));
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
