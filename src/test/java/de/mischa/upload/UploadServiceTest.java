package de.mischa.upload;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.assertj.core.api.Assertions;
import org.assertj.core.util.Arrays;
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

@RunWith(MockitoJUnitRunner.class)
public class UploadServiceTest {
	
	@Mock
	private CostItemRepository itemRep;

	@Mock
	private CostRecipientRepository recipientRep;
	
	@InjectMocks
	private UploadService uploadService;
	
	/**
	 * Given a cost import entry exactly one matching entry was found -> use it.
	 */
	@Test
	public void testOneMatchFound()
	{
		CostRecipient testRecipient = new CostRecipient( "TestRec");
		when(recipientRep.findByName(anyString())).thenReturn(testRecipient );
		
		CostItem matchingItem = new CostItem();
		matchingItem.setType(CostType.GEHALT);
		DetailedCostCluster detailedCluster = new DetailedCostCluster(CostCluster.GEHALT, "");
		matchingItem.setType(CostType.GEHALT);
		matchingItem.setDetailedCluster(detailedCluster);		
		List<CostItem> matchingItems = new ArrayList<CostItem>();
		matchingItems.add(matchingItem);
		when(itemRep.findByRecipient(testRecipient.getName())).thenReturn(matchingItems);
		
		CostImportEntry importEntry = new CostImportEntry(new Date(), testRecipient.getName(), "SomePurpose", 22.0);
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
		
	}
	
	/**
	 * Given a cost import entry multiple matching entries were found -> ???
	 */
	@Test
	public void testMultipleMatchesFound()
	{
		
	}

}
