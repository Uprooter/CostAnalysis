package de.mischa;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import de.mischa.readin.init.InitialCostItemImporterService;
import de.mischa.repository.CostItemRepository;

@SpringBootApplication
public class CostAnalysisApplication {

	private static final Logger logger = LoggerFactory.getLogger(CostAnalysisApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(CostAnalysisApplication.class, args);
	}

	@Bean
	public CommandLineRunner demo(CostItemRepository costRep, InitialCostItemImporterService initialImporter) {
		return (args) -> {

//			detailedClusterRep.save(new DetailedCostCluster(CostCluster.ALLGEMEIN, "Einkauf"));
//			detailedClusterRep.save(new DetailedCostCluster(CostCluster.UNTERHALTUNG, "Netflix"));
//
//			importer.getItems(ImportType.DB,
//					"C:\\Users\\Mischa\\Downloads\\Kontoumsaetze_670_568523500_20181117_101907.csv")
//					.forEach(costItem -> costRep.save(costItem));
//			
//			importer.getItems(ImportType.ING,
//					"C:\\Users\\Mischa\\Downloads\\Umsatzanzeige_DE39500105175422178243_20180916.csv")
//					.forEach(costItem -> costRep.save(costItem));

			initialImporter.createItems("C:\\Users\\Mischa\\Qsync\\Haushalt\\All.csv");
			logger.info(String.valueOf(costRep.findAll().size()));

		};
	}
}
