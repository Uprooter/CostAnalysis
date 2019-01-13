package de.mischa.service;

import de.mischa.model.CostCluster;
import de.mischa.model.DetailedCostCluster;
import de.mischa.repository.DetailedCostClusterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DetailedClusterService {
    @Autowired
    private DetailedCostClusterRepository detailedClusterRep;

    public DetailedCostCluster findOrDetailedCluster(CostCluster cluster, String detailedClusterName) {

        String correctedName = detailedClusterName;

        if (correctedName == null || correctedName.isEmpty()) {
            correctedName = "-";
        }
        DetailedCostCluster detailedCluster = this.detailedClusterRep.findByNameAndCluster(correctedName,
                cluster);
        if (detailedCluster == null) {
            detailedCluster = new DetailedCostCluster();
            detailedCluster.setName(correctedName);
            detailedCluster.setCluster(cluster);
            return this.detailedClusterRep.save(detailedCluster);
        }
        return detailedCluster;
    }
}
