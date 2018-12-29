package de.mischa.readin.init;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.mischa.model.CostCluster;
import de.mischa.model.CostItem;
import de.mischa.model.CostRecipient;
import de.mischa.model.DetailedCostCluster;
import de.mischa.repository.CostItemRepository;
import de.mischa.repository.CostRecipientRepository;
import de.mischa.repository.DetailedCostClusterRepository;

@Service
public class InitialCostItemImporterService {
	private Logger logger = LoggerFactory.getLogger(InitialCostItemImporterService.class);

	@Autowired
	private InitialCostReader reader;
	@Autowired
	private CostRecipientRepository recipientRep;
	@Autowired
	private DetailedCostClusterRepository detailedClusterRep;

	@Autowired
	private CostItemRepository costItemRep;

	public void createItems(String file) {

		try {
			reader.read(file).forEach(e -> this.createAndAddItem(e));
		} catch (IOException e) {
			this.logger.error(e.getLocalizedMessage());
		}
	}

	private void createAndAddItem(InitialCostImportEntry e) {
		CostItem item = new CostItem();
		item.setAmount(e.getAmount());
		item.setCreationDate(e.getDate());
		item.setOwner(e.getOwner());
		item.setPurpose(e.getPurpose());
		item.setRecipient(this.findOrCreateRecipient(e.getRecipient()));
		item.setType(e.getType());
		item.setDetailedCluster(this.findOrDetailedCluster(e.getCluster(), e.getDetailedCluster()));
		costItemRep.save(item);
	}

	private DetailedCostCluster findOrDetailedCluster(CostCluster cluster, String detailedClusterName) {
		DetailedCostCluster detailedCluster = this.detailedClusterRep.findByNameAndCluster(detailedClusterName,
				cluster);
		if (detailedCluster == null) {
			detailedCluster = new DetailedCostCluster();
			detailedCluster.setName(detailedClusterName);
			detailedCluster.setCluster(cluster);
			return this.detailedClusterRep.save(detailedCluster);
		}
		return detailedCluster;
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
