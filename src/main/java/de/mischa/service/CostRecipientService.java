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
        String correctedRecipient = getEmptyName(recipient);
        CostRecipient rec = costRecipientRepository.findByName(correctedRecipient);
        if (rec == null) {
            rec = new CostRecipient();
            rec.setName(correctedRecipient);
            return costRecipientRepository.save(rec);
        }
        return rec;
    }

    private String getEmptyName(String recipient) {
        String correctedRecipient = recipient;
        if (correctedRecipient == null || correctedRecipient.isEmpty()) {
            correctedRecipient = "-";
        }
        return correctedRecipient;
    }


    public CostRecipient findOrCreateTransientRecipient(String recipient) {
        CostRecipient rec = this.costRecipientRepository.findByName(this.getEmptyName(recipient));
        if (rec == null) {
            return new CostRecipient(recipient);
        }
        return rec;
    }
}
