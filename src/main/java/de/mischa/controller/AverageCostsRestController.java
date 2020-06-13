package de.mischa.controller;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import de.mischa.model.CostItem;
import de.mischa.repository.CostItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import de.mischa.calc.AverageCostsCalculationService;
import de.mischa.model.AverageCostModel;

@RestController
public class AverageCostsRestController {

    @Autowired
    private AverageCostsCalculationService service;
    @Autowired
    private CostItemRepository costItemRepository;

    @RequestMapping("/averageCosts")
    public AverageCostModel getAverageCosts(
            @RequestParam(value = "from") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate from, //
            @RequestParam(value = "to") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate to, //
            @RequestParam(value = "includeOthers") boolean includeOthers,
            @RequestParam(value = "savingsAreCosts") boolean savingsAreCosts
    ) {
        List<CostItem> relevantItems = this.costItemRepository.findRelevant(from, to);
        return service.calculate(relevantItems, includeOthers, savingsAreCosts);
    }
}
