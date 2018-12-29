package de.mischa.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "COST_ITEM")
@Data
public class CostItem {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column
	private Date creationDate;

	@ManyToOne
	@JoinColumn(name = "RECIPIENT_ID")
	private CostRecipient recipient;

	@Column
	private String purpose;

	@Column
	private Double amount;

	@Column
	@Enumerated(EnumType.STRING)
	private CostOwner owner;

	@Column
	@Enumerated(EnumType.STRING)
	private CostType type;

	@ManyToOne
	@JoinColumn(name = "DETAILED_CLUSTER_ID")
	private DetailedCostCluster detailedCluster;

}
