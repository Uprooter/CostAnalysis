package de.mischa.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import lombok.Data;

@Entity
@Table(name = "COST_RECIPIENT")
@Data
public class CostRecipient {

	public CostRecipient(String name) {
		this.name = name;
	}

	public CostRecipient() {
	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(unique = true)
	private String name;
	
	@Override
	public boolean equals(Object o) {
		if (!(o instanceof CostRecipient)) {
			return false;
		}

		CostRecipient other = (CostRecipient) o;

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
