package de.mischa.controller;

import de.mischa.model.CompareModel;
import de.mischa.service.CompareService;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class CompareClusterCostController {

    private final CompareService service;

    public CompareClusterCostController(CompareService service) {
        this.service = service;
    }

    @GetMapping("/compareClusterCosts")
    public List<CompareModel> getCompareItems(
            @RequestParam(value = "monthA") String monthA, //
            @RequestParam(value = "monthB") String monthB) {
        List<CompareModel> compareItems = new ArrayList<>();

        YearMonth m1 = YearMonth.parse(monthA, DateTimeFormatter.ofPattern("MM.yyyy"));
        YearMonth m2 = YearMonth.parse(monthB, DateTimeFormatter.ofPattern("MM.yyyy"));
        service.calculate(m1, m2).forEach((k, v) -> compareItems.add(new CompareModel(k, v)));
        return compareItems;
    }
}
