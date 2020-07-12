package de.mischa.service;

import de.mischa.model.ClusterCost;

import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;


@Service
public class CompareService {

    private final ClusterCostService clusterCostService;

    public CompareService(ClusterCostService clusterCostService) {
        this.clusterCostService = clusterCostService;
    }

    public Map<String, Double> calculate(YearMonth monthA, YearMonth monthB) {
        List<ClusterCost> monthACosts = this.clusterCostService.calculate(monthA.atDay(1), monthA.atEndOfMonth());
        List<ClusterCost> monthBCosts = this.clusterCostService.calculate(monthB.atDay(1), monthB.atEndOfMonth());
        Map<String, Double> compareItems = new HashMap<>();
        if (monthACosts != null) {
            monthACosts.forEach(cc -> compareItems.put(cc.getCluster().name(), cc.getTotalAmount()));
        }
        if (monthBCosts != null) {
            monthBCosts.forEach(
                    cc -> compareItems.merge(cc.getCluster().name(), cc.getTotalAmount(), (a, b) -> b - a)
            );
        }
        return compareItems;
    }
}
