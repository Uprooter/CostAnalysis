package de.mischa.rules;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import de.mischa.model.CostItem;
import de.mischa.model.DetailedCostCluster;
import de.mischa.repository.DetailedCostClusterRepository;

@Component
public class CostClusterRule {

	@Autowired
	private DetailedCostClusterRepository detailedRep;

	public DetailedCostCluster determine(CostItem item) {
		return detailedRep.findByName("Einkauf");
	}

}
