package de.mischa.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "COST_ITEM")
public class CostItem {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;

	@Column
	private Date creationDate;

	@ManyToOne
	@JoinColumn(name = "RECIPIENT_ID")
	private CostRecipient recipient;

	@Column
	private String reason;

	@Column
	private Double amount;

	@Column
	private CostOwner owner;
	
	@Column
	private CostType type;
	
	@Column
	private CostCluster cluster;
	
	@ManyToOne
	@JoinColumn(name = "DETAILED_CLUSTER_ID")
	private DetailedCostCluster detailedCluster;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	public CostRecipient getRecipient() {
		return recipient;
	}

	public void setRecipient(CostRecipient recipient) {
		this.recipient = recipient;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public CostOwner getOwner() {
		return owner;
	}

	public void setOwner(CostOwner owner) {
		this.owner = owner;
	}

	public CostType getType() {
		return type;
	}

	public void setType(CostType type) {
		this.type = type;
	}

	public CostCluster getCluster() {
		return cluster;
	}

	public void setCluster(CostCluster cluster) {
		this.cluster = cluster;
	}

	public DetailedCostCluster getDetailedCluster() {
		return detailedCluster;
	}

	public void setDetailedCluster(DetailedCostCluster detailedCluster) {
		this.detailedCluster = detailedCluster;
	}
	
	

}
