package de.mischa.rules;

import org.springframework.stereotype.Component;

import de.mischa.model.CostItem;
import de.mischa.model.CostType;

@Component
public class CostTypeRule {

	public CostType determine(CostItem item) {
		return CostType.FLEXIBEL;
	}

}
