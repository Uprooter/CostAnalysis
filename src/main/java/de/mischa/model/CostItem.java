package de.mischa.model;

import java.util.Date;

import javax.persistence.*;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import lombok.Data;

@Entity
@Table(name = "COST_ITEM")
@Data
public class CostItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "cost_item_id_gen")
    @SequenceGenerator(name = "cost_item_id_gen", allocationSize = 1, sequenceName = "ID_SEQUENCE")
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

    @Transient
    private int clientId;

    public String toString() {
        return "Cluster: " + this.getDetailedCluster().getCluster() + " Amount: " + this.getAmount() + " Recipient:"
                + this.getRecipient().getName();
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof CostItem)) {
            return false;
        }

        CostItem other = (CostItem) o;

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

    public static CostItem copy(CostItem toCopy) {
        CostItem copy = new CostItem();
        copy.setAmount(toCopy.getAmount());
        copy.setPurpose(toCopy.getPurpose());
        copy.setType(toCopy.getType());
        copy.setDetailedCluster(toCopy.getDetailedCluster());
        copy.setRecipient(toCopy.getRecipient());
        copy.setCreationDate(toCopy.getCreationDate());
        copy.setOwner(toCopy.getOwner());

        return copy;
    }

}
