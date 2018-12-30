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
import de.mischa.model.CostRecipient;
import de.mischa.readin.AbstractCostImporter;
import de.mischa.readin.CostImportEntry;
import de.mischa.readin.db.DBCostReader;
import de.mischa.readin.ing.INGCostReader;
import de.mischa.repository.CostItemRepository;
import de.mischa.repository.CostRecipientRepository;

@RestController
public class UploadRestController {

	@Autowired
	private CostItemRepository itemRep;

	@Autowired
	private CostRecipientRepository recipientRep;

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
			costItems.add(createItemFromImport(costOwner, i));
		});
		return costItems;
	}

	private CostItem createItemFromImport(CostOwner costOwner, CostImportEntry importItem) {
		CostItem item = new CostItem();
		item.setAmount(importItem.getAmount());
		item.setCreationDate(importItem.getDate());
		item.setPurpose(importItem.getPurpose());
		item.setOwner(costOwner);
		item.setRecipient(this.findOrCreateRecipient(importItem.getRecipient()));
		List<CostItem> similarItems = itemRep.findByRecipient(importItem.getRecipient());
		if (!similarItems.isEmpty()) {
			item.setType(similarItems.get(0).getType());
			item.setDetailedCluster(similarItems.get(0).getDetailedCluster());
		}

		return item;
	}

	private CostRecipient findOrCreateRecipient(String recipient) {
		CostRecipient rec = this.recipientRep.findByName(recipient);
		if (rec == null) {
			rec = new CostRecipient();
			rec.setName(recipient);
		}
		return rec;
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
