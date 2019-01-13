package de.mischa;

import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;

import de.mischa.model.CostItem;
import de.mischa.model.DuplicateCheckResult;
import de.mischa.readin.init.InitialCostItemImporterService;
import de.mischa.repository.CostItemRepository;
import de.mischa.upload.UploadService;

@SpringBootApplication
public class CostAnalysisApplication {

    private static final Logger logger = LoggerFactory.getLogger(CostAnalysisApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(CostAnalysisApplication.class, args);
    }

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jacksonObjectMapperCustomization() {
        return jacksonObjectMapperBuilder ->
                jacksonObjectMapperBuilder.timeZone(TimeZone.getTimeZone("Europe/Berlin"));
    }

    @Bean
    public CommandLineRunner demo(CostItemRepository costRep, InitialCostItemImporterService initialImporter) {
        return (args) -> {

            initialImporter.createItems("C:\\Users\\Mischa\\Qsync\\Haushalt\\All.csv");
            List<CostItem> allItems = costRep.findAll();
            logger.info(String.valueOf(allItems.size()));

//			Map<CostItem, CostItemPair> duplicates = uploadService.checkForDuplicates(allItems);
//			for (CostItem key : duplicates.keySet()) {
//				System.out.println(key.toString());
//			}
//			
//			System.out.println("Done");

        };
    }
}
