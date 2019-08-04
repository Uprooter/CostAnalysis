package de.mischa.controller;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import de.mischa.calc.AverageCostsCalculationService;
import de.mischa.model.AverageCostModel;

@RestController
public class AverageCostsRestContoller {

    @Autowired
    private AverageCostsCalculationService service;

    @RequestMapping("/averageCosts")
    public AverageCostModel getAverageCosts(
            @RequestParam(value = "from") @DateTimeFormat(pattern = "dd.MM.yyyy") Date from, //
            @RequestParam(value = "to") @DateTimeFormat(pattern = "dd.MM.yyyy") Date to, //
            @RequestParam(value = "includeOthers") boolean includeOthers,
            @RequestParam(value = "savingsAreCosts") boolean savingsAreCosts
    ) {
        return service.calculate(from, to, includeOthers, savingsAreCosts);
    }
}
