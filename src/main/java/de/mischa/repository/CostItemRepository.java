package de.mischa.repository;

import org.springframework.data.repository.CrudRepository;

import de.mischa.model.CostItem;

public interface CostItemRepository extends CrudRepository<CostItem, Long> {

}
