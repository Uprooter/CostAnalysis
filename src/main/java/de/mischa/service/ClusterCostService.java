package de.mischa.service;

import de.mischa.model.ClusterCost;
import de.mischa.model.CostCluster;
import de.mischa.model.CostItem;
import de.mischa.model.CostOwner;
import de.mischa.model.TimeFrameCostEntry;
import de.mischa.model.TimeFrameCostEntryComparator;
import de.mischa.repository.CostItemRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import de.mischa.utils.DateUtils;
import org.springframework.stereotype.Service;


@Service
public class ClusterCostService {

    private final CostItemRepository costItemRep;

    public ClusterCostService(CostItemRepository costItemRep) {
        this.costItemRep = costItemRep;
    }

    public List<ClusterCost> calculate(LocalDate from, LocalDate to) {

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

    public List<TimeFrameCostEntry> calculateYearly(CostCluster cluster) {
        Map<Integer, Double> mischaClusterCosts =
                this.costItemRep.findByClusterAndOwner(cluster, CostOwner.MISCHA).stream().collect(
                        Collectors.groupingBy(
                                CostItem::getCreationDateYear, Collectors.summingDouble(CostItem::getAmount)));
        Map<Integer, Double> gesaClusterCosts =
                this.costItemRep.findByClusterAndOwner(cluster, CostOwner.GESA).stream().collect(
                        Collectors.groupingBy(
                                CostItem::getCreationDateYear, Collectors.summingDouble(CostItem::getAmount)));

        List<TimeFrameCostEntry> result = new ArrayList<>();
        mischaClusterCosts.forEach((k, v) -> result.add(new TimeFrameCostEntry(k.toString(), v * -1.0, 0.0)));
        gesaClusterCosts.forEach((k, v) -> this.updateOrAddGesaYearlyAmount(k.toString(), v * -1.0, result));
        result.sort(Comparator.comparing(TimeFrameCostEntry::getTimeFrame));
        return result;
    }

    public List<TimeFrameCostEntry> calculateMonthlyLast12From(CostCluster cluster, LocalDate from) {

        LocalDate periodFrom = DateUtils.getOneYearBefore(from);
        LocalDate periodTo = from.withDayOfMonth(from.getMonth().length(from.isLeapYear()));

        Map<String, Double> mischaClusterCosts =
                this.costItemRep.findByClusterAndOwnerForPeriod(cluster, CostOwner.MISCHA, periodFrom, periodTo)
                        .stream().collect(
                        Collectors.groupingBy(
                                CostItem::getCreationDateMonthYear, Collectors.summingDouble(CostItem::getAmount)));
        Map<String, Double> gesaClusterCosts =
                this.costItemRep.findByClusterAndOwnerForPeriod(cluster, CostOwner.GESA, periodFrom, periodTo)
                        .stream().collect(
                        Collectors.groupingBy(
                                CostItem::getCreationDateMonthYear, Collectors.summingDouble(CostItem::getAmount)));

        List<TimeFrameCostEntry> result = new ArrayList<>();
        mischaClusterCosts.forEach((k, v) -> result.add(new TimeFrameCostEntry(k, v * -1.0, 0.0)));
        gesaClusterCosts.forEach((k, v) -> this.updateOrAddGesaMonthlyAmount(k, v * -1.0, result));
        result.sort(new TimeFrameCostEntryComparator());
        return result;
    }

    private void updateOrAddGesaYearlyAmount(String year, Double gesaAmount, List<TimeFrameCostEntry> result) {
        for (TimeFrameCostEntry yearlyCost : result) {
            if (yearlyCost.getTimeFrame().equals(year)) {
                yearlyCost.setGesaAmount(gesaAmount);
                return;
            }
        }

        result.add(new TimeFrameCostEntry(year, 0.0, gesaAmount));
    }

    private void updateOrAddGesaMonthlyAmount(String monthYear, Double gesaAmount, List<TimeFrameCostEntry> result) {
        for (TimeFrameCostEntry timeFrameCostEntry : result) {
            if (timeFrameCostEntry.getTimeFrame().equals(monthYear)) {
                timeFrameCostEntry.setGesaAmount(gesaAmount);
                return;
            }
        }

        result.add(new TimeFrameCostEntry(monthYear, 0.0, gesaAmount));
    }
}
