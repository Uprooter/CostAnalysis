package de.mischa.repository;


import org.springframework.data.repository.CrudRepository;

import de.mischa.model.DetailedCostCluster;

public interface DetailedCostClusterRepository extends CrudRepository<DetailedCostCluster, Long> {

	public DetailedCostCluster findByName(String name);

}
