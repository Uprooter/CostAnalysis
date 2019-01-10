package de.mischa.upload;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import de.mischa.model.CostCluster;
import de.mischa.model.CostItem;
import de.mischa.model.CostOwner;
import de.mischa.model.CostRecipient;
import de.mischa.model.CostType;
import de.mischa.model.DetailedCostCluster;
import de.mischa.readin.CostImportEntry;
import de.mischa.repository.CostItemRepository;
import de.mischa.repository.CostRecipientRepository;
import de.mischa.utils.DateUtils;

@RunWith(MockitoJUnitRunner.class)
public class UploadServiceTest {

	@Mock
	private CostRecipientRepository recpientRep;

	@Mock
	private CostItemRepository itemRep;

	@InjectMocks
	private UploadService uploadService;

	/**
	 * Given a cost import entry exactly one matching entry was found -> use it.
	 */
	@Test
	public void testOneMatchFound() {
		CostItem matchingItem = new CostItem();
		matchingItem.setType(CostType.GEHALT);
		DetailedCostCluster detailedCluster = new DetailedCostCluster(CostCluster.GEHALT, "");
		detailedCluster.setId(1L);
		matchingItem.setDetailedCluster(detailedCluster);
		List<CostItem> matchingItems = new ArrayList<CostItem>();
		matchingItems.add(matchingItem);
		when(itemRep.findByRecipientAndOwner(anyString(), any(CostOwner.class))).thenReturn(matchingItems);

		CostImportEntry importEntry = new CostImportEntry(new Date(), "TestRec", "SomePurpose", 22.0);
		CostItem derivedCostItem = this.uploadService.createItemFromImport(CostOwner.MISCHA, importEntry);
		Assertions.assertThat(derivedCostItem.getType()).isEqualTo(CostType.GEHALT);
		Assertions.assertThat(derivedCostItem.getDetailedCluster().getCluster()).isEqualTo(CostCluster.GEHALT);

	}

	/**
	 * Given a cost import entry no matching entry was found -> do not set any types
	 */
	@Test
	public void testNoneMatchFound() {
		when(itemRep.findByRecipientAndOwner(anyString(), any(CostOwner.class))).thenReturn(new ArrayList<CostItem>());

		CostImportEntry importEntry = new CostImportEntry(new Date(), "SomeUnknownRecipient", "SomePurpose", 22.0);
		CostItem derivedCostItem = this.uploadService.createItemFromImport(CostOwner.MISCHA, importEntry);
		Assertions.assertThat(derivedCostItem.getType()).isNull();
		Assertions.assertThat(derivedCostItem.getDetailedCluster().getName()).isNull();

	}

	/**
	 * Given a cost import entry multiple matching entries were found -> if all have
	 * same type and detailed cluster -> take first
	 */
	@Test
	public void testMultipleMatchesFoundPositive() {

		DetailedCostCluster detailedCluster = new DetailedCostCluster(CostCluster.GEHALT, "");
		detailedCluster.setId(1L);
		CostItem gehaltItem = new CostItem();
		gehaltItem.setId(1L);
		gehaltItem.setType(CostType.GEHALT);
		gehaltItem.setDetailedCluster(detailedCluster);

		CostItem anotherGehaltItem = new CostItem();
		anotherGehaltItem.setId(2L);
		anotherGehaltItem.setType(CostType.GEHALT);
		anotherGehaltItem.setDetailedCluster(detailedCluster);

		List<CostItem> matchingItems = new ArrayList<CostItem>();
		matchingItems.add(gehaltItem);
		matchingItems.add(anotherGehaltItem);
		when(itemRep.findByRecipientAndOwner(anyString(), any(CostOwner.class))).thenReturn(matchingItems);

		CostImportEntry importEntry = new CostImportEntry(new Date(), "TestRec", "SomePurpose", 22.0);
		CostItem derivedCostItem = this.uploadService.createItemFromImport(CostOwner.MISCHA, importEntry);
		Assertions.assertThat(derivedCostItem.getType()).isEqualTo(CostType.GEHALT);
		Assertions.assertThat(derivedCostItem.getDetailedCluster().getCluster()).isEqualTo(CostCluster.GEHALT);

	}

	/**
	 * Given a cost import entry multiple matching entries were found -> if all have
	 * same type and detailed cluster -> take first, else take none of them
	 */
	@Test
	public void testMultipleMatchesFoundNegative() {

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

		List<CostItem> matchingItems = new ArrayList<CostItem>();
		matchingItems.add(gehaltItem);
		matchingItems.add(anotherGehaltItem);
		when(itemRep.findByRecipientAndOwner(anyString(), any(CostOwner.class))).thenReturn(matchingItems);

		CostImportEntry importEntry = new CostImportEntry(new Date(), "TestRec", "SomePurpose", 22.0);
		CostItem derivedCostItem = this.uploadService.createItemFromImport(CostOwner.MISCHA, importEntry);
		Assertions.assertThat(derivedCostItem.getType()).isNull();
		Assertions.assertThat(derivedCostItem.getDetailedCluster().getName()).isNull();
	}

	/**
	 * What to do if import entry does not have a recipient? Try to match first
	 * characters / words of the purpose
	 */
	@Test
	public void testFindWithNoRecipientInfo() {

		String purposePrefix = "Some Pur pose";
		DetailedCostCluster detailedCluster = new DetailedCostCluster(CostCluster.GEHALT, "");
		CostItem gehaltItem = new CostItem();
		gehaltItem.setId(1L);
		gehaltItem.setPurpose(purposePrefix + " sdakdjjadjklk");
		gehaltItem.setType(CostType.GEHALT);
		gehaltItem.setDetailedCluster(detailedCluster);

		CostItem gehaltItem2 = new CostItem();
		gehaltItem2.setId(2L);
		gehaltItem2.setPurpose(purposePrefix + " 11111");
		gehaltItem2.setType(CostType.GEHALT);
		gehaltItem2.setDetailedCluster(detailedCluster);
		List<CostItem> matchingItems = new ArrayList<CostItem>();
		matchingItems.add(gehaltItem);
		matchingItems.add(gehaltItem2);
		when(itemRep.findByRecipientAndOwnerLatestFirst(anyString(), any(CostOwner.class))).thenReturn(matchingItems);

		CostImportEntry importEntry = new CostImportEntry(new Date(), null, purposePrefix + " dasdad", 22.0);
		CostItem derivedCostItem = this.uploadService.createItemFromImport(CostOwner.MISCHA, importEntry);
		Assertions.assertThat(derivedCostItem.getType()).isEqualTo(CostType.GEHALT);
		Assertions.assertThat(derivedCostItem.getDetailedCluster().getCluster()).isEqualTo(CostCluster.GEHALT);
	}

	/**
	 * What to do if import entry does not have a recipient? Try to match first
	 * characters / words of the purpose
	 */
	@Test
	public void testFindWithNoRecipientInfoNegative() {

		String purposePrefix = "Some Pur pose";
		DetailedCostCluster detailedCluster = new DetailedCostCluster(CostCluster.GEHALT, "");
		CostItem gehaltItem = new CostItem();
		gehaltItem.setId(1L);
		gehaltItem.setPurpose(purposePrefix + " sdakdjjadjklk");
		gehaltItem.setType(CostType.GEHALT);
		gehaltItem.setDetailedCluster(detailedCluster);

		CostItem gehaltItem2 = new CostItem();
		gehaltItem2.setId(2L);
		gehaltItem2.setPurpose(purposePrefix + " 11111");
		gehaltItem2.setType(CostType.GEHALT);
		gehaltItem2.setDetailedCluster(detailedCluster);
		List<CostItem> matchingItems = new ArrayList<CostItem>();
		matchingItems.add(gehaltItem);
		matchingItems.add(gehaltItem2);
		when(itemRep.findByRecipientAndOwnerLatestFirst(anyString(), any(CostOwner.class))).thenReturn(matchingItems);

		CostImportEntry importEntry = new CostImportEntry(new Date(), null, "dasd asd dasdad", 22.0);
		CostItem derivedCostItem = this.uploadService.createItemFromImport(CostOwner.MISCHA, importEntry);
		Assertions.assertThat(derivedCostItem.getType()).isNull();
	}

	@Test
	public void testGetFirstXWords() {
		Assertions.assertThat(this.uploadService.getFirstXWords("a b c d e", 3)).isEqualTo("a b c");
		Assertions.assertThat(this.uploadService.getFirstXWords("a b", 3)).isEqualTo("a b");
		Assertions.assertThat(this.uploadService.getFirstXWords("a", 3)).isEqualTo("a");
	}

	@Test
	public void testMatchByPurpose() {
		CostImportEntry importItem = new CostImportEntry(new Date(), null, "123", 22.0);
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

	@Test
	public void testFindEqual() {
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
		Assertions.assertThat(this.uploadService.foundEqual(itemToMatch, allItems)).isEqualTo(itemToMatch);

		CostItem differentDateItem = CostItem.copy(itemToMatch);
		differentDateItem.setId(2L);
		differentDateItem.setCreationDate(DateUtils.createDate("02.01.2018"));
		allItems.add(differentDateItem);
		Assertions.assertThat(this.uploadService.foundEqual(itemToMatch, allItems)).isEqualTo(itemToMatch);

		allItems = new ArrayList<>();
		allItems.add(differentDateItem);
		Assertions.assertThat(this.uploadService.foundEqual(itemToMatch, allItems)).isNull();

		CostItem differentAmount = CostItem.copy(itemToMatch);
		differentAmount.setId(3L);
		differentAmount.setAmount(21.0);

		allItems = new ArrayList<>();
		allItems.add(differentAmount);
		Assertions.assertThat(this.uploadService.foundEqual(itemToMatch, allItems)).isNull();

	}

	@Test
	public void testFindSimilar() {
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
		Assertions.assertThat(this.uploadService.foundSimilar(itemToMatch, allItems)).isEqualTo(itemToMatch);

		CostItem differentDateItem = CostItem.copy(itemToMatch);
		differentDateItem.setId(2L);
		differentDateItem.setCreationDate(DateUtils.createDate("02.01.2018"));
		allItems.add(differentDateItem);
		Assertions.assertThat(this.uploadService.foundSimilar(itemToMatch, allItems)).isEqualTo(itemToMatch);

		allItems = new ArrayList<>();
		allItems.add(differentDateItem);
		Assertions.assertThat(this.uploadService.foundSimilar(itemToMatch, allItems)).isNull();

		CostItem differentAmount = CostItem.copy(itemToMatch);
		differentAmount.setId(3L);
		differentAmount.setAmount(21.0);
		allItems = new ArrayList<>();
		allItems.add(differentAmount);
		Assertions.assertThat(this.uploadService.foundSimilar(itemToMatch, allItems)).isNull();

		CostItem purposeDifferent = CostItem.copy(itemToMatch);
		differentAmount.setId(4L);
		differentAmount.setPurpose("121");
		allItems = new ArrayList<>();
		allItems.add(purposeDifferent);
		Assertions.assertThat(this.uploadService.foundSimilar(itemToMatch, allItems)).isEqualTo(itemToMatch);
	}
}
