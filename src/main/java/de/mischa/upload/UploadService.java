package de.mischa.upload;

import de.mischa.model.*;
import de.mischa.readin.CostImportEntry;
import de.mischa.repository.CostItemRepository;
import de.mischa.repository.CostRecipientRepository;
import de.mischa.repository.DetailedCostClusterRepository;
import de.mischa.service.CostItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.StringTokenizer;

@Service
public class UploadService {

    @Autowired
    private CostItemRepository itemRep;

    @Autowired
    CostItemService itemService;

    @Autowired
    private CostRecipientRepository recipientRep;

    @Autowired
    private DetailedCostClusterRepository detailedCostClusterRepository;

    public CostItem createItemFromImport(CostOwner costOwner, CostImportEntry importItem) {
        CostItem item = new CostItem();
        item.setAmount(importItem.getAmount());
        item.setCreationDate(importItem.getDate());
        item.setPurpose(importItem.getPurpose());
        item.setOwner(costOwner);
        item.setRecipient(this.findOrCreateTransientRecipient(importItem.getRecipient()));

        if (item.getRecipient().getName() != null && !item.getRecipient().getName().isEmpty()) {
            List<CostItem> similarItems = itemRep.findByRecipientAndOwner(importItem.getRecipient(), costOwner);

            // Searching by recipient will probably result in a list of potentially
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
            return this.recipientRep.save(new CostRecipient(recipient));
        }
        return rec;
    }

    private CostRecipient findOrCreateTransientRecipient(String recipient) {
        CostRecipient rec = this.recipientRep.findByName(recipient);
        if (rec == null) {
            return new CostRecipient(recipient);
        }
        return rec;
    }

    public List<DuplicateCheckResult> saveItems(List<CostItem> correctedItems) {
        List<DuplicateCheckResult> potentialDuplicates = this.checkForDuplicates(correctedItems);
        if (potentialDuplicates.stream().map(DuplicateCheckResult::getDuplicateItem).anyMatch(Objects::nonNull)) {
            return potentialDuplicates;
        } else {

            this.createAndSetReceivers(correctedItems);
            this.createAndSetDetailedClusters(correctedItems);

            correctedItems.forEach(i -> {
                //TODO: need to introduce unique constraint for items on db level
                this.itemRep.save(i);
            });
        }

        return new ArrayList<>();

    }

    private void createAndSetDetailedClusters(List<CostItem> correctedItems) {
        correctedItems.forEach(i -> {
            if (i.getDetailedCluster().getId() == null) {
                i.setDetailedCluster(this.findOrCreateDetailedCluster(i.getDetailedCluster().getCluster(), i.getDetailedCluster().getName()));
            }
        });
    }

    private DetailedCostCluster findOrCreateDetailedCluster(CostCluster cluster, String name) {
        DetailedCostCluster detail = this.detailedCostClusterRepository.findByNameAndCluster(name, cluster);
        if (detail == null) {
            return this.detailedCostClusterRepository.save(new DetailedCostCluster(cluster, name));
        }
        return detail;
    }

    private void createAndSetReceivers(List<CostItem> correctedItems) {
        correctedItems.forEach(i -> {
            if (i.getRecipient().getId() == null) {
                i.setRecipient(this.findOrCreateRecipient(i.getRecipient().getName()));
            }
        });
    }

    private List<DuplicateCheckResult> checkForDuplicates(List<CostItem> correctedItems) throws ResponseStatusException {

        List<DuplicateCheckResult> foundSimilarItems = new ArrayList<>();
        List<CostItem> allItems = this.itemRep.findAll();
        for (CostItem item : correctedItems) {
            CostItem equalItem = this.itemService.foundEqual(item, allItems);
            CostItem verySimilarItem = this.itemService.foundSimilar(item, allItems);

            if (equalItem != null || verySimilarItem != null) {
                foundSimilarItems.add(new DuplicateCheckResult(item, equalItem, verySimilarItem));
            }
        }

        return foundSimilarItems;

    }

}
