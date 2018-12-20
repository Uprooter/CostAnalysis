package de.mischa.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import de.mischa.model.CostItem;

public interface CostItemRepository extends CrudRepository<CostItem, Long> {

	@Query("SELECT c FROM CostItem c WHERE c.creationDate between :from and :to and d.cluster")
	List<CostItem> findRelevant(@Param("from") Date from, @Param("to") Date to);

}
