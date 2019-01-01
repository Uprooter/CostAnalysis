package de.mischa.upload;

import java.util.List;

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
		List<CostItem> similarItems = itemRep.findByRecipient(importItem.getRecipient());
		if (!similarItems.isEmpty()) {
			item.setType(similarItems.get(0).getType());
			item.setDetailedCluster(similarItems.get(0).getDetailedCluster());
		}

		return item;
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
