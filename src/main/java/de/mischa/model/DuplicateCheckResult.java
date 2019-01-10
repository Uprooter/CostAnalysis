package de.mischa.model;

import lombok.Data;

@Data
public class DuplicateCheckResult {

	private CostItem clientItem;

	private CostItem equalItem;

	private CostItem similarItem;

	public DuplicateCheckResult(CostItem clientItem, CostItem equalItem, CostItem similarItem) {
		this.clientItem = clientItem;
		this.equalItem = equalItem;
		this.similarItem = similarItem;
	}
}
