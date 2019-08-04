package de.mischa.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.mischa.repository.DetailedCostClusterRepository;

@RestController
public class DetailedClusterRestController {

	@Autowired
	private DetailedCostClusterRepository rep;

	@RequestMapping("/detailedClusterNames")
	public List<String> getDetailedClusterNames() {
		return this.rep.findAllDistinctNames();
	}
}
