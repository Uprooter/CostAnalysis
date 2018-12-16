package de.mischa.repository;

import org.springframework.data.repository.CrudRepository;

import de.mischa.model.CostRecipient;

public interface CostRecipientRepository extends CrudRepository<CostRecipient, Long> {

	public CostRecipient findByName(String name);

}
