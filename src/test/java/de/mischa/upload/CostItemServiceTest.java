package de.mischa.upload;

import de.mischa.model.CostCluster;
import de.mischa.model.CostItem;
import de.mischa.model.CostRecipient;
import de.mischa.model.CostType;
import de.mischa.model.DetailedCostCluster;
import de.mischa.service.CostItemService;
import de.mischa.utils.DateUtils;
import java.util.ArrayList;
import java.util.List;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.junit.MockitoJUnitRunner;


@RunWith(MockitoJUnitRunner.class)
public class CostItemServiceTest
{

   @InjectMocks
   private CostItemService itemService;

   @Test
   public void testFindEqual()
   {
      DetailedCostCluster detailedCluster = new DetailedCostCluster(CostCluster.GEHALT, "");
      CostItem itemToMatch = new CostItem();
      itemToMatch.setId(1L);
      itemToMatch.setAmount(22.0);
      itemToMatch.setPurpose("SomePurpose");
      itemToMatch.setType(CostType.GEHALT);
      itemToMatch.setDetailedCluster(detailedCluster);
      itemToMatch.setRecipient(new CostRecipient("SomeRecipient"));
      itemToMatch.setCreationDate(DateUtils.createDate("01.01.2018"));

      List<CostItem> allItems = new ArrayList<>();
      allItems.add(itemToMatch);
      Assertions.assertThat(this.itemService.findEqual(itemToMatch, allItems)).isEqualTo(itemToMatch);

      CostItem differentDateItem = CostItem.copy(itemToMatch);
      differentDateItem.setId(2L);
      differentDateItem.setCreationDate(DateUtils.createDate("02.01.2018"));
      allItems.add(differentDateItem);
      Assertions.assertThat(this.itemService.findEqual(itemToMatch, allItems)).isEqualTo(itemToMatch);

      allItems = new ArrayList<>();
      allItems.add(differentDateItem);
      Assertions.assertThat(this.itemService.findEqual(itemToMatch, allItems)).isNull();

      CostItem differentAmount = CostItem.copy(itemToMatch);
      differentAmount.setId(3L);
      differentAmount.setAmount(21.0);

      allItems = new ArrayList<>();
      allItems.add(differentAmount);
      Assertions.assertThat(this.itemService.findEqual(itemToMatch, allItems)).isNull();
   }

   @Test
   public void testFindSimilar()
   {
      CostItem itemToMatch = new CostItem();
      itemToMatch.setId(1L);
      itemToMatch.setAmount(22.0);
      itemToMatch.setPurpose("SomePurpose");
      itemToMatch.setType(CostType.GEHALT);
      itemToMatch.setDetailedCluster(new DetailedCostCluster(CostCluster.GEHALT, ""));
      itemToMatch.setRecipient(new CostRecipient("SomeRecipient"));
      itemToMatch.setCreationDate(DateUtils.createDate("01.01.2018"));

      List<CostItem> allItems = new ArrayList<>();
      allItems.add(itemToMatch);
      Assertions.assertThat(this.itemService.findSimilar(itemToMatch, allItems)).isEqualTo(itemToMatch);

      CostItem differentDateItem = CostItem.copy(itemToMatch);
      differentDateItem.setId(2L);
      differentDateItem.setCreationDate(DateUtils.createDate("02.01.2018"));
      allItems.add(differentDateItem);
      Assertions.assertThat(this.itemService.findSimilar(itemToMatch, allItems)).isEqualTo(itemToMatch);

      allItems = new ArrayList<>();
      allItems.add(differentDateItem);
      Assertions.assertThat(this.itemService.findSimilar(itemToMatch, allItems)).isNull();

      CostItem differentAmount = CostItem.copy(itemToMatch);
      differentAmount.setId(3L);
      differentAmount.setAmount(21.0);
      allItems = new ArrayList<>();
      allItems.add(differentAmount);
      Assertions.assertThat(this.itemService.findSimilar(itemToMatch, allItems)).isNull();

      CostItem purposeDifferent = CostItem.copy(itemToMatch);
      differentAmount.setId(4L);
      differentAmount.setPurpose("121");
      allItems = new ArrayList<>();
      allItems.add(purposeDifferent);
      Assertions.assertThat(this.itemService.findSimilar(itemToMatch, allItems)).isNotNull();
      Assertions.assertThat(this.itemService.findSimilar(itemToMatch, allItems).getPurpose()).isEqualTo("SomePurpose");
   }
}
