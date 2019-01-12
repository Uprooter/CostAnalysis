package de.mischa.model;

import lombok.Data;

@Data
public class DuplicateCheckResult {

	private CostItem clientItem;

	private CostItem duplicateItem;

	private CostItem similarItem;

	public DuplicateCheckResult(CostItem clientItem, CostItem duplicateItem, CostItem similarItem) {
		this.clientItem = clientItem;
		this.duplicateItem = duplicateItem;
		this.similarItem = similarItem;
	}
}
