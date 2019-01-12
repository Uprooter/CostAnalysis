package de.mischa.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
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

	@RequestMapping("/clusters")
	public List<CostCluster> getClusters() {
		return Arrays.asList(CostCluster.values());
	}

	@RequestMapping("/clustersByDetailed")
	public List<CostCluster> getClustersByDetailedCluster(@RequestParam("detailedCluster") String detailedCluster)
			throws UnsupportedEncodingException {
		String decodedName = URLDecoder.decode(detailedCluster, StandardCharsets.UTF_8.toString());
		return detailedClusterRep.findByName(decodedName).stream().map(d -> d.getCluster()).distinct()
				.collect(Collectors.toList());
	}

}
