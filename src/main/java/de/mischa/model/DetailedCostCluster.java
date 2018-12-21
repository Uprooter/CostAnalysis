package de.mischa.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "DETAILED_COST_CLUSTER")
@Data
public class DetailedCostCluster {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private CostCluster cluster;

	private String name;

	public DetailedCostCluster() {

	}

	public DetailedCostCluster(CostCluster cluster, String name) {
		super();
		this.cluster = cluster;
		this.name = name;
	}
}
