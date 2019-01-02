package de.mischa.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.mischa.model.CostType;

@RestController
public class CostTypeRestController {

	@RequestMapping("/api/types")
	public List<CostType> getTypes() {
		return Arrays.asList(CostType.values());
	}

}
