package de.mischa.service;

import de.mischa.model.CostRecipient;
import de.mischa.repository.CostRecipientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CostRecipientService {

    @Autowired
    private CostRecipientRepository costRecipientRepository;


    public CostRecipient findOrCreateRecipient(String recipient) {
        String correctedRecipient = recipient;
        if (correctedRecipient == null || correctedRecipient.isEmpty()) {
            correctedRecipient = "-";
        }
        CostRecipient rec = costRecipientRepository.findByName(correctedRecipient);
        if (rec == null) {
            rec = new CostRecipient();
            rec.setName(correctedRecipient);
            return costRecipientRepository.save(rec);
        }
        return rec;
    }
}
