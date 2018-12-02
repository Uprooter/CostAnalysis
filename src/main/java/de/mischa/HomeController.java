package de.mischa;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {

	@RequestMapping(value = "/")
	public String index() {
		return "index";
	}

	@RequestMapping(value = "/upload")
	public String upload() {
		return "index";
	}

	@RequestMapping(value = "/detailedclusters")
	public String detailedClusters() {
		return "index";
	}
}
