package de.mischa.upload;

import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import de.mischa.model.CostItem;
import de.mischa.model.DuplicateCheckResult;
import de.mischa.model.CostOwner;
import de.mischa.model.CostRecipient;
import de.mischa.model.DetailedCostCluster;
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
			List<CostItem> similarItems = itemRep.findByRecipientAndOwner(importItem.getRecipient(), costOwner);

			// Searching by recipient will probably result in a list of potentionally
			// different items
			// If all of them have same type and detail cluster -> just take first
			if (!similarItems.isEmpty() && this.allSimilarHaveSameTypeAndCluster(similarItems)) {
				item.setType(similarItems.get(0).getType());
				item.setDetailedCluster(similarItems.get(0).getDetailedCluster());

			} else if (!similarItems.isEmpty()) {
				// If not all are of same type use the purpose to find the first right one
				this.matchByPurpose(importItem, item, similarItems);
			}
		} else {
			// Without recipient match by purpose
			List<CostItem> itemsWithEmptyRecipient = itemRep.findByRecipientAndOwnerLatestFirst("", costOwner);
			this.matchByPurpose(importItem, item, itemsWithEmptyRecipient);
		}

		// JSON mappings works better this way
		if (item.getDetailedCluster() == null) {
			item.setDetailedCluster(new DetailedCostCluster());
		}

		return item;
	}

	void matchByPurpose(CostImportEntry importItem, CostItem item, List<CostItem> itemsWithEmptyRecipient) {
		String first3Words = this.getFirstXWords(PurposeCleaner.clean(importItem.getPurpose()), 3);

		for (CostItem i : itemsWithEmptyRecipient) {
			String myFirst3Words = this.getFirstXWords(PurposeCleaner.clean(i.getPurpose()), 3);
			if (first3Words.equals(myFirst3Words)) {
				item.setType(i.getType());
				item.setDetailedCluster(i.getDetailedCluster());
				break;
			}
		}
	}

	String getFirstXWords(String originalString, int numberOfWords) {
		if (originalString != null && originalString.contains(" ")) {
			StringTokenizer tok = new StringTokenizer(originalString, " ");
			List<String> words = new ArrayList<String>();
			while (tok.hasMoreTokens()) {
				words.add(tok.nextToken());
			}

			if (words.size() >= numberOfWords) {
				return String.join(" ", words.subList(0, numberOfWords));
			}
			return String.join(" ", words);
		}
		return originalString;
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

	public List<DuplicateCheckResult> saveItems(List<CostItem> correctedItems) {
		List<DuplicateCheckResult> potentialDuplicates = this.checkForDuplicates(correctedItems);
		if (!potentialDuplicates.isEmpty()) {
			return potentialDuplicates;
		} else {

			// 1. create receivers and detailed clusters

			// 2. save
		}

		return new ArrayList<>();

	}

	public List<DuplicateCheckResult> checkForDuplicates(List<CostItem> correctedItems) throws ResponseStatusException {

		List<DuplicateCheckResult> foundSimilarItems = new ArrayList<>();
		List<CostItem> allItems = this.itemRep.findAll();
		for (CostItem item : correctedItems) {
			CostItem equalItem = this.foundEqual(item, allItems);
			CostItem verySimilarItem = this.foundSimilar(item, allItems);

			if (equalItem != null || verySimilarItem != null) {
				foundSimilarItems.add(new DuplicateCheckResult(item, equalItem, verySimilarItem));
			}
		}

		return foundSimilarItems;

	}

	CostItem foundSimilar(CostItem item, List<CostItem> allItems) {
		for (CostItem existingItem : allItems) {

			boolean dateEqual = DateUtils.isSameDay(item.getCreationDate(), existingItem.getCreationDate());
			boolean recipientEqual = item.getRecipient().getName().equals(existingItem.getRecipient().getName());
			boolean amountEqual = item.getAmount() == existingItem.getAmount();

			if (dateEqual && recipientEqual && amountEqual) {
				return existingItem;
			}
		}

		return null;
	}

	CostItem foundEqual(CostItem item, List<CostItem> allItems) {
		for (CostItem existingItem : allItems) {
			boolean dateEqual = DateUtils.isSameDay(item.getCreationDate(), existingItem.getCreationDate());
			boolean recipientEqual = item.getRecipient().getName().equals(existingItem.getRecipient().getName());
			boolean amountEqual = item.getAmount().doubleValue() == existingItem.getAmount().doubleValue();
			boolean typeEqual = item.getType() == existingItem.getType();
			boolean detailedCusterEqual = item.getDetailedCluster().getName()
					.equals(existingItem.getDetailedCluster().getName());
			boolean clusterEqual = item.getDetailedCluster().getCluster() == existingItem.getDetailedCluster()
					.getCluster();

			if (dateEqual && recipientEqual && amountEqual && typeEqual && detailedCusterEqual && clusterEqual) {
				return existingItem;
			}
		}

		return null;
	}

}
