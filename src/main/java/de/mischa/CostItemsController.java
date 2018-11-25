package de.mischa;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CostItemsController {

	@RequestMapping(value="/items")
	public String index()
	{
		return "index";
	}
}
