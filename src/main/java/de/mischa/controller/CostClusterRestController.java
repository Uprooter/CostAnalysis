package de.mischa.controller;

import de.mischa.model.*;
import de.mischa.repository.CostItemRepository;
import de.mischa.repository.DetailedCostClusterRepository;
import de.mischa.service.ClusterCostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class CostClusterRestController {

    @Autowired
    private DetailedCostClusterRepository detailedClusterRep;

    @Autowired
    private ClusterCostService clusterCostService;

    @Autowired
    private CostItemRepository costItemRepository;

    @RequestMapping("/clusters")
    public List<CostCluster> getClusters() {
        return Arrays.asList(CostCluster.values());
    }

    @RequestMapping("/clustersByDetailed")
    public List<CostCluster> getClustersByDetailedCluster(@RequestParam("detailedCluster") String detailedCluster)
            throws UnsupportedEncodingException {
        String decodedName = URLDecoder.decode(detailedCluster, StandardCharsets.UTF_8.toString());
        return detailedClusterRep.findByName(decodedName).stream().map(DetailedCostCluster::getCluster).distinct()
                .collect(Collectors.toList());
    }

    @RequestMapping("/clusterCosts")
    public List<ClusterCost> getClusterCosts(
            @RequestParam(value = "from") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate from,
            @RequestParam(value = "to") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate to) {
        return clusterCostService.calculate(from, to);
    }

    @RequestMapping("/clusterCostsByCluster")
    public List<CostItem> getClusterCosts(
            @RequestParam(value = "from") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate from,
            @RequestParam(value = "to") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate to,
            @RequestParam(value = "clusterName") String clusterName) {
        return costItemRepository.findRelevantByCluster(from, to, CostCluster.valueOf(clusterName));
    }

    @RequestMapping("/costsByClusterYearly")
    public List<TimeFrameCostEntry> getYearlyCostsByCluster(@RequestParam(value = "cluster") String clusterName) {
        if (clusterName != null && !clusterName.isEmpty()) {
            return clusterCostService.calculateYearly(CostCluster.valueOf(clusterName));
        } else {
            return new ArrayList<>();
        }
    }

    @RequestMapping("/costsByClusterMonthly")
    public List<TimeFrameCostEntry> getMonthlyCostsByCluster(
            @RequestParam(value = "cluster") String clusterName,
            @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate from) {
        if (clusterName != null && !clusterName.isEmpty()) {
            return clusterCostService.calculateMonthlyLast12From(CostCluster.valueOf(clusterName), from);
        } else {
            return new ArrayList<>();
        }
    }
}
