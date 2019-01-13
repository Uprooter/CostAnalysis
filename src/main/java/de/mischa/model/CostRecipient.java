package de.mischa.model;

import javax.persistence.*;

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
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "cost_recipient_id_gen")
    @SequenceGenerator(name = "cost_recipient_id_gen", allocationSize = 1, sequenceName = "ID_SEQUENCE")
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
