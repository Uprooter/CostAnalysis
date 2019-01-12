package de.mischa.service;

import de.mischa.model.CostItem;
import de.mischa.repository.CostItemRepository;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CostItemService {
    @Autowired
    private CostItemRepository itemRep;

    public CostItem foundSimilar(CostItem item, List<CostItem> allItems) {
        for (CostItem existingItem : allItems) {

            boolean dateEqual = DateUtils.isSameDay(item.getCreationDate(), existingItem.getCreationDate());
            boolean recipientEqual = item.getRecipient().getName().equals(existingItem.getRecipient().getName());
            boolean amountEqual = item.getAmount().doubleValue() == existingItem.getAmount().doubleValue();

            if (dateEqual && recipientEqual && amountEqual) {
                return existingItem;
            }
        }

        return null;
    }

    public CostItem foundEqual(CostItem item, List<CostItem> allItems) {
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
