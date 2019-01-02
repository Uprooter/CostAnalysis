package de.mischa.controller;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import de.mischa.model.CostCluster;
import de.mischa.repository.DetailedCostClusterRepository;

@RestController
public class CostClusterRestController {

	@Autowired
	private DetailedCostClusterRepository detailedClusterRep;

	@RequestMapping("/api/clusters")
	public List<CostCluster> getClusters() {
		return Arrays.asList(CostCluster.values());
	}

	@RequestMapping("/api/clustersByDetailed")
	public List<CostCluster> getClustersByDetailedCluster(@RequestParam("detailedCluster") String detailedCluster) {
		return detailedClusterRep.findByName(detailedCluster).stream().map(d -> d.getCluster()).distinct()
				.collect(Collectors.toList());
	}

}
