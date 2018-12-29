package de.mischa.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import de.mischa.readin.AbstractCostImporter;
import de.mischa.readin.CostImportEntry;
import de.mischa.readin.db.DBCostReader;
import de.mischa.readin.ing.INGCostReader;

@RestController
public class UploadRestController {

	private static final Logger logger = LoggerFactory.getLogger(UploadRestController.class);

	@RequestMapping(value = "/api/upload", method = RequestMethod.POST)
	public List<CostImportEntry> getAverageCosts(@RequestParam("file") MultipartFile file) {
		try {
			AbstractCostImporter reader = this.determineReader(file.getInputStream());

			if (reader != null) {
				return reader.read(file.getInputStream());
			} else {
				return new ArrayList<CostImportEntry>();
			}
		} catch (IOException e) {
			logger.info(e.getLocalizedMessage());
		}
		return new ArrayList<CostImportEntry>();
	}

	private AbstractCostImporter determineReader(InputStream inputStream) throws IOException {
		BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));

		while (reader.ready()) {
			String firstLine = reader.readLine();

			if (firstLine.startsWith("Umsatzanzeige")) {
				return new INGCostReader();
			} else {
				return new DBCostReader();
			}
		}

		return null;
	}

}
