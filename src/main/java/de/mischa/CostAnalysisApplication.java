package de.mischa;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import de.mischa.model.CostCluster;
import de.mischa.model.DetailedCostCluster;
import de.mischa.repository.DetailedCostClusterRepository;

@SpringBootApplication
public class CostAnalysisApplication {

	private static final Logger logger = LoggerFactory.getLogger(CostAnalysisApplication.class);
	
	public static void main(String[] args) {
		SpringApplication.run(CostAnalysisApplication.class, args);
	}
	
	@Bean
	public CommandLineRunner demo(DetailedCostClusterRepository rep)
	{
		return (args) ->{
			
			rep.save(new DetailedCostCluster(CostCluster.UNTERHALTUNG, "New"));
			rep.save(new DetailedCostCluster(CostCluster.UNTERHALTUNG, "New2"));
			
			for(DetailedCostCluster cluster : rep.findAll())
			{
				logger.info(cluster.getName());
			}			
			
		};
	}
}
