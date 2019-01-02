package de.mischa.repository;


import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import de.mischa.model.CostCluster;
import de.mischa.model.DetailedCostCluster;

public interface DetailedCostClusterRepository extends CrudRepository<DetailedCostCluster, Long> {

	public DetailedCostCluster findByNameAndCluster(String name, CostCluster cluster);
	
	public List<DetailedCostCluster> findByName(String name);
	
	@Query("SELECT DISTINCT c.name FROM DetailedCostCluster c where c.name<>'' order by c.name asc")
	public List<String> findAllDistinctNames();

}
