package de.mischa.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ClusterCost {
    private CostCluster cluster;
    private double mischaAmount;
    private double gesaAmount;
    private double totalAmount;
}
