package de.mischa;

import de.mischa.model.ClusterCost;
import de.mischa.model.CostCluster;
import de.mischa.service.ClusterCostService;
import de.mischa.service.CompareService;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static org.mockito.Mockito.when;


@RunWith(MockitoJUnitRunner.class)
public class CompareServiceTest
{
   @Mock
   private ClusterCostService clusterCostService;
   @InjectMocks
   private CompareService compareService;

   @Test
   public void testCalculate()
   {
      List<ClusterCost> janCosts= new ArrayList<>();
      janCosts.add(new ClusterCost(CostCluster.SPAREN,100,0,100));
      when(clusterCostService.calculate(LocalDate.of(2019,1,1), LocalDate.of(2019,1,31))).thenReturn(janCosts);

      List<ClusterCost> febCosts= new ArrayList<>();
      febCosts.add(new ClusterCost(CostCluster.SPAREN,80,0,80));
      when(clusterCostService.calculate(LocalDate.of(2019,2,1), LocalDate.of(2019,2,28))).thenReturn(febCosts);

      Map<String, Double> clusterDivs = this.compareService.calculate(YearMonth.of(2019, 1), YearMonth.of(2019, 2));
      Assertions.assertThat(clusterDivs.get(CostCluster.SPAREN.name())).isEqualTo(-20.0);
   }
}
