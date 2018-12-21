package de.mischa.readin;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.mischa.model.CostItem;
import de.mischa.model.CostOwner;
import de.mischa.model.CostRecipient;
import de.mischa.model.DetailedCostCluster;
import de.mischa.readin.db.DBCostImporter;
import de.mischa.readin.ing.INGCostImporter;
import de.mischa.repository.CostRecipientRepository;
import de.mischa.rules.CostClusterRule;
import de.mischa.rules.CostTypeRule;

@Service
public class CostItemImporterService {
	private Logger logger = LoggerFactory.getLogger(CostItemImporterService.class);

	@Autowired
	private DBCostImporter dbImporter;
	@Autowired
	private INGCostImporter ingImporter;
	@Autowired
	private CostRecipientRepository recipientRep;
	@Autowired
	private CostTypeRule typeRule;
	@Autowired
	private CostClusterRule clusterRule;

	public List<CostItem> getItems(ImportType importType, String file) {

		List<CostItem> items = new ArrayList<CostItem>();
		AbstractCostImporter importer = this.getImporter(importType);

		try {
			CostOwner owner = importer.getCostOwner();
			importer.read(file).forEach(e -> this.createAndAddItem(e, items, owner));
		} catch (IOException e) {
			this.logger.error(e.getLocalizedMessage());
		}

		return items;
	}

	private AbstractCostImporter getImporter(ImportType importType) {
		AbstractCostImporter importer = null;

		if (ImportType.DB == importType) {
			importer = dbImporter;

		} else if (ImportType.ING == importType) {
			importer = ingImporter;
		}
		return importer;
	}

	private void createAndAddItem(CostImportEntry e, List<CostItem> items, CostOwner owner) {
		CostItem item = new CostItem();
		item.setAmount(e.getAmount());
		item.setCreationDate(e.getDate());
		item.setOwner(owner);
		item.setPurpose(e.getPurpose());
		item.setRecipient(this.findOrCreateRecipient(e.getRecipient()));
		item.setType(typeRule.determine(item));
		DetailedCostCluster detailedCluster = this.clusterRule.determine(item);
		item.setDetailedCluster(detailedCluster);
		items.add(item);
	}

	private CostRecipient findOrCreateRecipient(String recipient) {
		CostRecipient rec = this.recipientRep.findByName(recipient);
		if (rec == null) {
			rec = new CostRecipient();
			rec.setName(recipient);
			rec = this.recipientRep.save(rec);
		}
		return rec;
	}

}
