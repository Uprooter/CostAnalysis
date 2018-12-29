package de.mischa.repository;


import org.springframework.data.repository.CrudRepository;

import de.mischa.model.CostCluster;
import de.mischa.model.DetailedCostCluster;

public interface DetailedCostClusterRepository extends CrudRepository<DetailedCostCluster, Long> {

	public DetailedCostCluster findByNameAndCluster(String name, CostCluster cluster);

}
