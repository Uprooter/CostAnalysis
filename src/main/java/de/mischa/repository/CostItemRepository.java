package de.mischa.repository;

import de.mischa.model.CostCluster;
import de.mischa.model.CostItem;
import de.mischa.model.CostOwner;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface CostItemRepository extends CrudRepository<CostItem, Long> {

    @Query("SELECT c FROM CostItem c WHERE c.creationDate between :from and :to")
    List<CostItem> findRelevant(@Param("from") Date from, @Param("to") Date to);

    List<CostItem> findAll();

    @Query("SELECT c FROM CostItem c WHERE c.recipient.name=:recipientName and c.owner=:owner")
    List<CostItem> findByRecipientAndOwner(String recipientName, CostOwner owner);

    @Query("SELECT c FROM CostItem c WHERE c.recipient.name=:recipientName and c.owner=:owner order by c.id desc")
    List<CostItem> findByRecipientAndOwnerLatestFirst(String recipientName, CostOwner owner);

    @Query("SELECT c FROM CostItem c WHERE c.detailedCluster.cluster=:cluster and c.owner=:owner order by c.creationDate asc")
    List<CostItem> findByClusterAndOwner(CostCluster cluster, CostOwner owner);

    @Query("SELECT c FROM CostItem c WHERE c.creationDate between :from and :to and c.detailedCluster.cluster=:cluster")
    List<CostItem> findRelevantByCluster(Date from, Date to, CostCluster cluster);
}
