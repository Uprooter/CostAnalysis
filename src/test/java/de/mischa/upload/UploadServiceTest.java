package de.mischa.upload;

import de.mischa.model.CostCluster;
import de.mischa.model.CostItem;
import de.mischa.model.CostOwner;
import de.mischa.model.CostRecipient;
import de.mischa.model.CostType;
import de.mischa.model.DetailedCostCluster;
import de.mischa.readin.CostImportEntry;
import de.mischa.repository.CostItemRepository;
import de.mischa.service.CostRecipientService;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;


@RunWith(MockitoJUnitRunner.class)
public class UploadServiceTest
{
   @Mock
   private CostItemRepository itemRep;

   @Mock
   private CostRecipientService recipientService;

   @InjectMocks
   private UploadService uploadService;

   /**
    * Given a cost import entry exactly one matching entry was found -> use it.
    */
   @Test
   public void testOneMatchFound()
   {
      String recipientName = "TestRec";
      CostRecipient rep = new CostRecipient(recipientName);
      CostItem matchingItem = new CostItem();
      matchingItem.setRecipient(rep);
      matchingItem.setType(CostType.GEHALT);
      DetailedCostCluster detailedCluster = new DetailedCostCluster(CostCluster.GEHALT, "");
      detailedCluster.setId(1L);
      matchingItem.setDetailedCluster(detailedCluster);
      List<CostItem> matchingItems = new ArrayList<>();
      matchingItems.add(matchingItem);
      when(itemRep.findByRecipientAndOwner(anyString(), any(CostOwner.class))).thenReturn(matchingItems);
      when(recipientService.findOrCreateTransientRecipient(anyString())).thenReturn(rep);

      CostImportEntry importEntry = new CostImportEntry(LocalDate.now(), recipientName, "SomePurpose", 22.0);
      CostItem derivedCostItem = this.uploadService.createItemFromImport(CostOwner.MISCHA, importEntry);
      Assertions.assertThat(derivedCostItem.getType()).isEqualTo(CostType.GEHALT);
      Assertions.assertThat(derivedCostItem.getDetailedCluster().getCluster()).isEqualTo(CostCluster.GEHALT);

   }

   /**
    * Given a cost import entry no matching entry was found -> do not set any types
    */
   @Test
   public void testNoneMatchFound()
   {
      when(recipientService.findOrCreateTransientRecipient(anyString())).thenReturn(new CostRecipient());

      CostImportEntry importEntry = new CostImportEntry(LocalDate.now(), "SomeUnknownRecipient", "SomePurpose", 22.0);
      CostItem derivedCostItem = this.uploadService.createItemFromImport(CostOwner.MISCHA, importEntry);
      Assertions.assertThat(derivedCostItem.getType()).isNull();
      Assertions.assertThat(derivedCostItem.getDetailedCluster().getName()).isNull();
   }

   /**
    * Given a cost import entry multiple matching entries were found -> if all have
    * same type and detailed cluster -> take first
    */
   @Test
   public void testMultipleMatchesFoundPositive()
   {

      String recipientName = "TestRec";
      CostRecipient rep = new CostRecipient(recipientName);
      DetailedCostCluster detailedCluster = new DetailedCostCluster(CostCluster.GEHALT, "");
      detailedCluster.setId(1L);
      CostItem gehaltItem = new CostItem();
      gehaltItem.setRecipient(rep);
      gehaltItem.setId(1L);
      gehaltItem.setType(CostType.GEHALT);
      gehaltItem.setDetailedCluster(detailedCluster);

      CostItem anotherGehaltItem = new CostItem();
      anotherGehaltItem.setRecipient(rep);
      anotherGehaltItem.setId(2L);
      anotherGehaltItem.setType(CostType.GEHALT);
      anotherGehaltItem.setDetailedCluster(detailedCluster);

      List<CostItem> matchingItems = Arrays.asList(gehaltItem, anotherGehaltItem);
      when(itemRep.findByRecipientAndOwner(anyString(), any(CostOwner.class))).thenReturn(matchingItems);
      when(recipientService.findOrCreateTransientRecipient(anyString())).thenReturn(rep);

      CostImportEntry importEntry = new CostImportEntry(LocalDate.now(), recipientName, "SomePurpose", 22.0);
      CostItem derivedCostItem = this.uploadService.createItemFromImport(CostOwner.MISCHA, importEntry);
      Assertions.assertThat(derivedCostItem.getType()).isEqualTo(CostType.GEHALT);
      Assertions.assertThat(derivedCostItem.getDetailedCluster().getCluster()).isEqualTo(CostCluster.GEHALT);

   }

   /**
    * Given a cost import entry multiple matching entries were found -> if all have
    * same type and detailed cluster -> take first, else take none of them
    */
   @Test
   public void testMultipleMatchesFoundNegative()
   {

      DetailedCostCluster detailedCluster = new DetailedCostCluster(CostCluster.GEHALT, "");
      detailedCluster.setId(1L);
      CostItem gehaltItem = new CostItem();
      gehaltItem.setId(1L);
      gehaltItem.setType(CostType.GEHALT);
      gehaltItem.setDetailedCluster(detailedCluster);

      CostItem anotherGehaltItem = new CostItem();
      anotherGehaltItem.setId(2L);
      anotherGehaltItem.setType(CostType.FEST);
      anotherGehaltItem.setDetailedCluster(detailedCluster);

      List<CostItem> matchingItems = new ArrayList<>();
      matchingItems.add(gehaltItem);
      matchingItems.add(anotherGehaltItem);
      when(recipientService.findOrCreateTransientRecipient(anyString())).thenReturn(new CostRecipient());

      CostImportEntry importEntry = new CostImportEntry(LocalDate.now(), "TestRec", "SomePurpose", 22.0);
      CostItem derivedCostItem = this.uploadService.createItemFromImport(CostOwner.MISCHA, importEntry);
      Assertions.assertThat(derivedCostItem.getType()).isNull();
      Assertions.assertThat(derivedCostItem.getDetailedCluster().getName()).isNull();
   }

   /**
    * What to do if import entry does not have a recipient? Try to match first
    * characters / words of the purpose
    */
   @Test
   public void testFindWithNoRecipientInfo()
   {

      String recipientName = "TestRec";
      CostRecipient rep = new CostRecipient(recipientName);
      String purposePrefix = "Some Pur pose";
      DetailedCostCluster detailedCluster = new DetailedCostCluster(CostCluster.GEHALT, "");
      CostItem gehaltItem = new CostItem();
      gehaltItem.setRecipient(rep);
      gehaltItem.setId(1L);
      gehaltItem.setPurpose(purposePrefix + " sdakdjjadjklk");
      gehaltItem.setType(CostType.GEHALT);
      gehaltItem.setDetailedCluster(detailedCluster);

      CostItem gehaltItem2 = new CostItem();
      gehaltItem2.setId(2L);
      gehaltItem2.setRecipient(rep);
      gehaltItem2.setPurpose(purposePrefix + " 11111");
      gehaltItem2.setType(CostType.GEHALT);
      gehaltItem2.setDetailedCluster(detailedCluster);

      List<CostItem> matchingItems = Arrays.asList(gehaltItem, gehaltItem2);

      when(itemRep.findByRecipientAndOwnerLatestFirst(anyString(), any(CostOwner.class))).thenReturn(matchingItems);
      when(recipientService.findOrCreateTransientRecipient(anyString())).thenReturn(new CostRecipient());

      CostImportEntry importEntry = new CostImportEntry(LocalDate.now(), "", purposePrefix + " dasdad", 22.0);
      CostItem derivedCostItem = this.uploadService.createItemFromImport(CostOwner.MISCHA, importEntry);
      Assertions.assertThat(derivedCostItem.getType()).isEqualTo(CostType.GEHALT);
      Assertions.assertThat(derivedCostItem.getDetailedCluster().getCluster()).isEqualTo(CostCluster.GEHALT);
   }

   /**
    * What to do if import entry does not have a recipient? Try to match first
    * characters / words of the purpose
    */
   @Test
   public void testFindWithNoRecipientInfoNegative()
   {

      CostRecipient rep = new CostRecipient("SomeRecipient");
      String purposePrefix = "Some Pur pose";
      DetailedCostCluster detailedCluster = new DetailedCostCluster(CostCluster.GEHALT, "");
      CostItem gehaltItem = new CostItem();
      gehaltItem.setId(1L);
      gehaltItem.setRecipient(rep);
      gehaltItem.setPurpose(purposePrefix + " sdakdjjadjklk");
      gehaltItem.setType(CostType.GEHALT);
      gehaltItem.setDetailedCluster(detailedCluster);

      CostItem gehaltItem2 = new CostItem();
      gehaltItem2.setId(2L);
      gehaltItem2.setRecipient(rep);
      gehaltItem2.setPurpose(purposePrefix + " 11111");
      gehaltItem2.setType(CostType.GEHALT);
      gehaltItem2.setDetailedCluster(detailedCluster);
      List<CostItem> matchingItems = Arrays.asList(gehaltItem, gehaltItem2);
      when(itemRep.findByRecipientAndOwnerLatestFirst(anyString(), any(CostOwner.class))).thenReturn(matchingItems);
      when(recipientService.findOrCreateTransientRecipient(anyString())).thenReturn(new CostRecipient());

      CostImportEntry importEntry = new CostImportEntry(LocalDate.now(), "", "dasd asd dasdad", 22.0);
      CostItem derivedCostItem = this.uploadService.createItemFromImport(CostOwner.MISCHA, importEntry);
      Assertions.assertThat(derivedCostItem.getType()).isNull();
   }

   @Test
   public void testGetFirstXWords()
   {
      Assertions.assertThat(this.uploadService.getFirstXWords("a b c d e", 3)).isEqualTo("a b c");
      Assertions.assertThat(this.uploadService.getFirstXWords("a b", 3)).isEqualTo("a b");
      Assertions.assertThat(this.uploadService.getFirstXWords("a", 3)).isEqualTo("a");
   }

   @Test
   public void testMatchByPurpose()
   {
      CostImportEntry importItem = new CostImportEntry(LocalDate.now(), null, "123", 22.0);
      CostItem item = new CostItem();
      List<CostItem> itemsWithEmptyRecipient = new ArrayList<>();
      CostItem dbItem1 = new CostItem();
      dbItem1.setType(CostType.GEHALT);
      dbItem1.setPurpose("123");
      CostItem dbItem2 = new CostItem();
      dbItem2.setPurpose("abc");
      dbItem2.setType(CostType.FEST);
      itemsWithEmptyRecipient.add(dbItem1);
      itemsWithEmptyRecipient.add(dbItem2);

      this.uploadService.matchByPurpose(importItem, item, itemsWithEmptyRecipient);
      Assertions.assertThat(item.getType()).isEqualTo(CostType.GEHALT);
   }

}
