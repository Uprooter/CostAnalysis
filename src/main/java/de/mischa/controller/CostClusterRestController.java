package de.mischa.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.mischa.model.CostCluster;

@RestController
public class CostClusterRestController {

	@RequestMapping("/api/clusters")
	public List<CostCluster> getClusters() {
		return Arrays.asList(CostCluster.values());
	}

}
