package de.mischa.model;

import lombok.Data;

@Data
public class AverageCostModel {

	private double fixedCostsMischa;
	private double fixedCostsGesa;
	private double totalAverageFixedCosts;

	private double flexCostsMischa;
	private double flexCostsGesa;
	private double totalAverageFlexCosts;

	private double totalAverageMischa;
	private double totalAverageGesa;
	
	private double totalCosts;
	
	private double averageSavingsMischa;
	private double averageSavingsGesa;
	private double totalAverageSavings;

	private double absoluteDiffMischa;
	private double absoluteDiffGesa;
	private double absoluteTotalDiff;

}
