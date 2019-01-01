package de.mischa.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

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

	@Override
	public boolean equals(Object o) {
		if (!(o instanceof DetailedCostCluster)) {
			return false;
		}

		DetailedCostCluster other = (DetailedCostCluster) o;

		if (this.getId() == null || other.getId() == null) {
			return false;
		}
		EqualsBuilder builder = new EqualsBuilder();
		builder.append(getId(), other.getId());
		return builder.isEquals();
	}

	@Override
	public int hashCode() {
		HashCodeBuilder builder = new HashCodeBuilder();
		builder.append(getId());
		return builder.hashCode();
	}
}
