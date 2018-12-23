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

			//initialImporter.createItems("All.csv");
			logger.info(String.valueOf(costRep.findAll().size()));

		};
	}
}
