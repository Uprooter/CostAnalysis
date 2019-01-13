package de.mischa.readin.init;

import de.mischa.model.CostItem;
import de.mischa.repository.CostItemRepository;
import de.mischa.repository.CostRecipientRepository;
import de.mischa.repository.DetailedCostClusterRepository;
import de.mischa.service.CostRecipientService;
import de.mischa.service.DetailedClusterService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class InitialCostItemImporterService {
    private Logger logger = LoggerFactory.getLogger(InitialCostItemImporterService.class);

    @Autowired
    private InitialCostReader reader;
    @Autowired
    private CostRecipientRepository recipientRep;
    @Autowired
    private CostRecipientService costRecipientService;
    @Autowired
    private DetailedClusterService detailedClusterService;
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
        item.setRecipient(this.costRecipientService.findOrCreateRecipient(e.getRecipient()));
        item.setType(e.getType());
        item.setDetailedCluster(this.detailedClusterService.findOrDetailedCluster(e.getCluster(), e.getDetailedCluster()));
        costItemRep.save(item);
    }
}
