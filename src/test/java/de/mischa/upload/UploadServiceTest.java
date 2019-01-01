package de.mischa.upload;

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
import de.mischa.model.CostType;
import de.mischa.model.DetailedCostCluster;
import de.mischa.readin.CostImportEntry;
import de.mischa.repository.CostItemRepository;
import de.mischa.repository.CostRecipientRepository;

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
		when(itemRep.findByRecipient(anyString())).thenReturn(matchingItems);

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
		when(itemRep.findByRecipient(anyString())).thenReturn(new ArrayList<CostItem>());

		CostImportEntry importEntry = new CostImportEntry(new Date(), "SomeUnknownRecipient", "SomePurpose", 22.0);
		CostItem derivedCostItem = this.uploadService.createItemFromImport(CostOwner.MISCHA, importEntry);
		Assertions.assertThat(derivedCostItem.getType()).isNull();
		Assertions.assertThat(derivedCostItem.getDetailedCluster()).isNull();

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
		when(itemRep.findByRecipient(anyString())).thenReturn(matchingItems);

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
		when(itemRep.findByRecipient(anyString())).thenReturn(matchingItems);

		CostImportEntry importEntry = new CostImportEntry(new Date(), "TestRec", "SomePurpose", 22.0);
		CostItem derivedCostItem = this.uploadService.createItemFromImport(CostOwner.MISCHA, importEntry);
		Assertions.assertThat(derivedCostItem.getType()).isNull();
		Assertions.assertThat(derivedCostItem.getDetailedCluster()).isNull();
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
		when(itemRep.findByRecipientLatestFirst(anyString())).thenReturn(matchingItems);

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
		when(itemRep.findByRecipientLatestFirst(anyString())).thenReturn(matchingItems);

		CostImportEntry importEntry = new CostImportEntry(new Date(), null, "dasd asd dasdad", 22.0);
		CostItem derivedCostItem = this.uploadService.createItemFromImport(CostOwner.MISCHA, importEntry);
		Assertions.assertThat(derivedCostItem.getType()).isNull();
	}

	@Test
	public void testGetFirstXWords() {
		Assertions.assertThat(this.uploadService.getFirstXWords("a b c d e", 3)).isEqualTo("a b c");
	}

}
