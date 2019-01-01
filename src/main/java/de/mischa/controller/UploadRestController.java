package de.mischa.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import de.mischa.model.CostItem;
import de.mischa.model.CostOwner;
import de.mischa.readin.AbstractCostImporter;
import de.mischa.readin.CostImportEntry;
import de.mischa.readin.db.DBCostReader;
import de.mischa.readin.ing.INGCostReader;
import de.mischa.upload.UploadService;

@RestController
public class UploadRestController {

	@Autowired
	private UploadService uploadService;

	private static final Logger logger = LoggerFactory.getLogger(UploadRestController.class);

	@RequestMapping(value = "/api/upload", method = RequestMethod.POST)
	public List<CostItem> getAverageCosts(@RequestParam("file") MultipartFile file) {
		try {
			AbstractCostImporter reader = this.determineReader(file.getInputStream());

			if (reader != null) {
				return this.createItems(reader.read(file.getInputStream()), reader.getCostOwner());
			} else {
				logger.info("Could not determine format");
				return new ArrayList<CostItem>();
			}
		} catch (IOException e) {
			logger.info(e.getLocalizedMessage());
		}
		return new ArrayList<CostItem>();
	}

	private List<CostItem> createItems(List<CostImportEntry> importEntries, CostOwner costOwner) {
		List<CostItem> costItems = new ArrayList<CostItem>();
		importEntries.forEach(i -> {
			costItems.add(this.uploadService.createItemFromImport(costOwner, i));
		});
		return costItems;
	}

	private AbstractCostImporter determineReader(InputStream inputStream) throws IOException {
		BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.ISO_8859_1));

		while (reader.ready()) {
			String firstLine = reader.readLine();

			if (firstLine.startsWith("Umsatzanzeige")) {
				return new INGCostReader();
			} else if (firstLine.startsWith("Umsätze ")) {
				return new DBCostReader();
			} else {
				return null;
			}
		}

		return null;
	}

}
