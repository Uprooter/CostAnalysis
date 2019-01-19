package de.mischa.service;

import de.mischa.model.ClusterCost;
import de.mischa.model.CostCluster;
import de.mischa.model.CostItem;
import de.mischa.model.CostOwner;
import de.mischa.repository.CostItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ClusterCostService {

    @Autowired
    private CostItemRepository costItemRep;

    public List<ClusterCost> calculate(Date from, Date to) {

        List<CostItem> relevantItems = this.costItemRep.findRelevant(from, to);

        Map<CostCluster, Map<CostOwner, Double>> clusterCosts = this.sortCostsByClusterAndOwner(relevantItems);

        List<ClusterCost> result = new ArrayList<>();
        for (CostCluster cluster : clusterCosts.keySet()) {
            double mischaAmount = clusterCosts.get(cluster).get(CostOwner.MISCHA) != null
                    ? clusterCosts.get(cluster).get(CostOwner.MISCHA) : 0;
            double gesaAmount = clusterCosts.get(cluster).get(CostOwner.GESA) != null
                    ? clusterCosts.get(cluster).get(CostOwner.GESA) : 0;
            double totalAmount = mischaAmount + gesaAmount;
            result.add(new ClusterCost(cluster, mischaAmount, gesaAmount, totalAmount));

        }

        result.sort(Comparator.comparing(ClusterCost::getTotalAmount));
        return result;
    }

    private Map<CostCluster, Map<CostOwner, Double>> sortCostsByClusterAndOwner(List<CostItem> relevantItems) {

        Map<CostCluster, Map<CostOwner, Double>> clusterMap = new HashMap<>();
        relevantItems.forEach(i -> {
            CostOwner owner = i.getOwner();
            CostCluster cluster = i.getDetailedCluster().getCluster();
            if (clusterMap.containsKey(cluster)) {
                if (clusterMap.get(cluster).containsKey(owner)) {
                    double oldAmount = clusterMap.get(cluster).get(owner);
                    clusterMap.get(cluster).put(owner, oldAmount + i.getAmount());
                } else {
                    clusterMap.get(cluster).put(owner, i.getAmount());
                }

            } else {
                Map<CostOwner, Double> ownerCost = new HashMap<>();
                ownerCost.put(owner, i.getAmount());
                clusterMap.put(cluster, ownerCost);
            }
        });
        return clusterMap;
    }
}