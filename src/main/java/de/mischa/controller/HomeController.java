package de.mischa.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {

	@RequestMapping(value = { "", "/", "upload", "detailedclusters" })
	public String index() {
		return "index";
	}
}
