package de.mischa.rules;

import org.springframework.stereotype.Component;

import de.mischa.model.CostItem;
import de.mischa.model.CostType;

/**
 * Rule to determine automatically which kind of cost item type (Flexibel, Fix or Gehalt) it is.
 * @author Mischa
 *
 */
@Component
public class CostTypeRule {

	public CostType determine(CostItem item) {
		return CostType.FLEXIBEL;
	}

}
