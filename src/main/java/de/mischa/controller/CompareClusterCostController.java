package de.mischa.controller;

import de.mischa.model.CompareModel;
import de.mischa.service.CompareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
public class CompareClusterCostController {

    @Autowired
    private CompareService service;

    @RequestMapping("/compareClusterCosts")
    public List<CompareModel> getCompareItems(
            @RequestParam(value = "monthA") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate monthA, //
            @RequestParam(value = "monthB") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate monthB
    ) {
        List<CompareModel> compareItems = new ArrayList<>();

        service.calculate(YearMonth.of(monthA.getYear(), monthA.getMonth()),
                YearMonth.of(monthB.getYear(), monthB.getMonth()))
                .forEach((k, v) -> compareItems.add(new CompareModel(k, v)));
        return compareItems;
    }
}
