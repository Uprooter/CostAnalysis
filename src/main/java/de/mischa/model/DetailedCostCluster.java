package de.mischa.model;

import lombok.Data;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import javax.persistence.*;

@Entity
@Table(name = "DETAILED_COST_CLUSTER")
@Data
@SequenceGenerator(name = "detailed_cluster_id_gen", allocationSize = 1, sequenceName = "ID_SEQUENCE")
public class DetailedCostCluster {

    public static final String DAUERAUFTRAG = "Dauerauftrag";
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "detailed_cluster_id_gen")
    @Column(nullable = false, name = "ID", unique = true)
    private Long id;

    @Column(nullable = false, name = "COST_CLUSTER")
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
