package de.mischa.calc;

import static org.hamcrest.CoreMatchers.is;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.junit.Assert;
import org.junit.Test;

import de.mischa.model.AverageCostModel;
import de.mischa.model.CostItem;
import de.mischa.model.CostOwner;
import de.mischa.model.CostType;

public class AverageCostsCalculationServiceTests {

	@Test
	public void testMonthlySums() {
		List<CostItem> costTypeItems = new ArrayList<CostItem>();
		costTypeItems.add(this.createCostItems(LocalDate.of(2018, 9, 1), -100.0));
		costTypeItems.add(this.createCostItems(LocalDate.of(2018, 9, 1), -50.0));
		costTypeItems.add(this.createCostItems(LocalDate.of(2018, 10, 1), -100.0));
		costTypeItems.add(this.createCostItems(LocalDate.of(2019, 9, 1), -100.0));

		Map<String, Double> monthlySums = new AverageCostsCalculationService().getMonthlySums(costTypeItems);
		Assert.assertThat(monthlySums.keySet().size(), is(3));
		Assert.assertThat(monthlySums.get("92018"), is(-150.0));
	}

	@Test
	public void testMonthlyAverage() {
		List<CostItem> costTypeItems = new ArrayList<CostItem>();
		costTypeItems.add(this.createCostItems(LocalDate.of(2018, 9, 1), -100.0));
		costTypeItems.add(this.createCostItems(LocalDate.of(2018, 10, 1), -200.0));
		costTypeItems.add(this.createCostItems(LocalDate.of(2019, 9, 1), -150.0));

		double monthlyAverage = new AverageCostsCalculationService().calculateMonthlyAverage(costTypeItems,
				CostOwner.MISCHA, CostType.FEST);
		Assert.assertThat(monthlyAverage, is(-150.0));
	}

	@Test
	public void testResult() {
		List<CostItem> costTypeItems = new ArrayList<CostItem>();
		costTypeItems.add(this.createCostItem(LocalDate.of(2018, 9, 1), 100.0, CostOwner.MISCHA, CostType.GEHALT));
		costTypeItems.add(this.createCostItem(LocalDate.of(2018, 10, 1), 100.0, CostOwner.MISCHA, CostType.GEHALT));

		costTypeItems.add(this.createCostItem(LocalDate.of(2018, 9, 1), -100.0, CostOwner.MISCHA, CostType.FEST));
		costTypeItems.add(this.createCostItem(LocalDate.of(2018, 10, 1), -200.0, CostOwner.MISCHA, CostType.FEST));

		costTypeItems.add(this.createCostItem(LocalDate.of(2018, 9, 1), -100.0, CostOwner.MISCHA, CostType.FLEXIBEL));
		costTypeItems.add(this.createCostItem(LocalDate.of(2018, 10, 1), -50.0, CostOwner.MISCHA, CostType.FLEXIBEL));

		costTypeItems.add(this.createCostItem(LocalDate.of(2018, 9, 1), 300.0, CostOwner.GESA, CostType.GEHALT));
		costTypeItems.add(this.createCostItem(LocalDate.of(2018, 10, 1), 300.0, CostOwner.GESA, CostType.GEHALT));

		costTypeItems.add(this.createCostItem(LocalDate.of(2018, 9, 1), -50.0, CostOwner.GESA, CostType.FEST));
		costTypeItems.add(this.createCostItem(LocalDate.of(2018, 10, 1), -25.0, CostOwner.GESA, CostType.FEST));

		costTypeItems.add(this.createCostItem(LocalDate.of(2018, 9, 1), -100.0, CostOwner.GESA, CostType.FLEXIBEL));
		costTypeItems.add(this.createCostItem(LocalDate.of(2018, 10, 1), -120.0, CostOwner.GESA, CostType.FLEXIBEL));

		AverageCostModel calculateResult = new AverageCostsCalculationService().calculateResult(costTypeItems);
		Assert.assertThat(calculateResult.getFixedCostsMischa(), is(-150.0));
		Assert.assertThat(calculateResult.getFlexCostsMischa(), is(-75.0));
		Assert.assertThat(calculateResult.getTotalAverageMischa(), is(-225.0));
		Assert.assertThat(calculateResult.getDiffMischa(), is(-250.0));
		
		Assert.assertThat(calculateResult.getFixedCostsGesa(), is(-37.5));
		Assert.assertThat(calculateResult.getFlexCostsGesa(), is(-110.0));
		Assert.assertThat(calculateResult.getTotalAverageGesa(), is(-147.5));
		Assert.assertThat(calculateResult.getDiffGesa(), is(305.0));
		
		Assert.assertThat(calculateResult.getTotalAverageFixedCosts(), is(-187.5));
		Assert.assertThat(calculateResult.getTotalAverageFlexCosts(), is(-185.0));
		Assert.assertThat(calculateResult.getTotalDiff(), is(55.0));
	}

	private CostItem createCostItem(LocalDate localDate, double amount, CostOwner owner, CostType type) {
		CostItem item = new CostItem();
		item.setCreationDate(new Date(localDate.toEpochDay()));
		item.setAmount(amount);
		item.setOwner(owner);
		item.setType(type);
		return item;
	}

	private CostItem createCostItems(LocalDate localDate, double amount) {
		return this.createCostItem(localDate, amount, CostOwner.MISCHA, CostType.FEST);
	}

}
