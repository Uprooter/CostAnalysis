package de.mischa.upload;

import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.mischa.model.CostItem;
import de.mischa.model.CostOwner;
import de.mischa.model.CostRecipient;
import de.mischa.readin.CostImportEntry;
import de.mischa.repository.CostItemRepository;
import de.mischa.repository.CostRecipientRepository;

@Service
public class UploadService {

	@Autowired
	private CostItemRepository itemRep;

	@Autowired
	private CostRecipientRepository recipientRep;

	public CostItem createItemFromImport(CostOwner costOwner, CostImportEntry importItem) {
		CostItem item = new CostItem();
		item.setAmount(importItem.getAmount());
		item.setCreationDate(importItem.getDate());
		item.setPurpose(importItem.getPurpose());
		item.setOwner(costOwner);
		item.setRecipient(this.findOrCreateRecipient(importItem.getRecipient()));

		if (item.getRecipient().getName() != null && !item.getRecipient().getName().isEmpty()) {
			List<CostItem> similarItems = itemRep.findByRecipient(importItem.getRecipient());
			if (!similarItems.isEmpty() && this.allSimilarHaveSameTypeAndCluster(similarItems)) {
				item.setType(similarItems.get(0).getType());
				item.setDetailedCluster(similarItems.get(0).getDetailedCluster());
			}
		} else {
			String first3Words = this.getFirstXWords(PurposeCleaner.clean(importItem.getPurpose()), 3);
			List<CostItem> itemsWithEmptyRecipient = itemRep.findByRecipientLatestFirst("");
			for (CostItem i : itemsWithEmptyRecipient) {
				String myFirst3Words = this.getFirstXWords(PurposeCleaner.clean(i.getPurpose()), 3);
				if (first3Words.equals(myFirst3Words)) {
					item.setType(i.getType());
					item.setDetailedCluster(i.getDetailedCluster());
					break;
				}
			}
		}

		return item;
	}

	String getFirstXWords(String originalString, int numberOfWords) {
		StringTokenizer tok = new StringTokenizer(originalString, " ");
		List<String> words = new ArrayList<String>();
		while (tok.hasMoreTokens()) {
			words.add(tok.nextToken());
		}
		return String.join(" ", words.subList(0, numberOfWords));
	}

	private boolean allSimilarHaveSameTypeAndCluster(List<CostItem> similarItems) {

		CostItem toCompareTo = similarItems.get(0);
		for (CostItem i : similarItems) {
			if (i.getType() != toCompareTo.getType()
					|| !i.getDetailedCluster().equals(toCompareTo.getDetailedCluster())) {
				return false;
			}
		}
		return true;
	}

	private CostRecipient findOrCreateRecipient(String recipient) {
		CostRecipient rec = this.recipientRep.findByName(recipient);
		if (rec == null) {
			rec = new CostRecipient();
			rec.setName(recipient);
		}
		return rec;
	}

}
