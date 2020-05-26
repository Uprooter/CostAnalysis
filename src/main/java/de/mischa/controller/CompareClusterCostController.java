package de.mischa.controller;

import de.mischa.model.CompareModel;
import de.mischa.service.CompareService;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class CompareClusterCostController
{

   private final CompareService service;

   public CompareClusterCostController(CompareService service)
   {
      this.service = service;
   }

   @GetMapping("/compareClusterCosts")
   public List<CompareModel> getCompareItems(
         @RequestParam(value = "monthA") @DateTimeFormat(pattern = "MM.yyyy") YearMonth monthA, //
         @RequestParam(value = "monthB") @DateTimeFormat(pattern = "MM.yyyy") YearMonth monthB)
   {
      List<CompareModel> compareItems = new ArrayList<>();

      service.calculate(monthA, monthB).forEach((k, v) -> compareItems.add(new CompareModel(k, v)));
      return compareItems;
   }
}
