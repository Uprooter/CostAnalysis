package de.mischa.controller;

import de.mischa.model.*;
import de.mischa.repository.CostItemRepository;
import de.mischa.repository.DetailedCostClusterRepository;
import de.mischa.service.ClusterCostService;
import de.mischa.utils.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
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
    public List<ClusterCost> getClusterCosts(@RequestParam(value = "from") String from,
                                             @RequestParam(value = "to") String to) {
        return clusterCostService.calculate(DateUtils.createDate(from), DateUtils.createDate(to));
    }

    @RequestMapping("/clusterCostsByCluster")
    public List<CostItem> getClusterCosts(
            @RequestParam(value = "from") String from,
            @RequestParam(value = "to") String to,
            @RequestParam(value = "clusterName") String clusterName) {
        LocalDate m1 = DateUtils.createDate(from);
        LocalDate m2 = DateUtils.createDate(to);
        return costItemRepository.findRelevantByCluster(m1, m2, CostCluster.valueOf(clusterName));
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
    public List<TimeFrameCostEntry>
    getMonthlyCostsByCluster(@RequestParam(value = "cluster") String clusterName, String from) {

        LocalDate m1 = DateUtils.createDate(from);
        if (clusterName != null && !clusterName.isEmpty()) {
            return clusterCostService.calculateMonthlyLast12From(CostCluster.valueOf(clusterName), m1);
        } else {
            return new ArrayList<>();
        }
    }
}
