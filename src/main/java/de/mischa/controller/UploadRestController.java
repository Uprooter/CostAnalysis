package de.mischa.controller;

import de.mischa.model.CostItem;
import de.mischa.model.CostOwner;
import de.mischa.model.DuplicateCheckResult;
import de.mischa.model.UploadedItems;
import de.mischa.readin.AbstractCostImporter;
import de.mischa.readin.CostImportEntry;
import de.mischa.readin.db.DBCostReader;
import de.mischa.readin.ing.INGCostReader;
import de.mischa.upload.UploadService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

@RestController
public class UploadRestController {

    @Autowired
    private UploadService uploadService;

    private Comparator<CostImportEntry> dateComparator = Comparator.comparing(CostImportEntry::getDate);

    private static final Logger logger = LoggerFactory.getLogger(UploadRestController.class);

    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    public List<CostItem> uploadNewItems(@RequestParam("file") MultipartFile file) {
        try {
            AbstractCostImporter reader = this.determineReader(file.getInputStream());

            if (reader != null) {
                return this.createItems(reader.read(file.getInputStream()), reader.getCostOwner());
            } else {
                logger.info("Could not determine format");
                return new ArrayList<>();
            }
        } catch (IOException e) {
            logger.info(e.getLocalizedMessage());
        }
        return new ArrayList<>();
    }

    @RequestMapping(value = "/upload/single", method = RequestMethod.POST)
    public CostItem uploadSingleItem(@RequestParam("recipientName") String recipientName,
                                     @RequestParam("purpose") String purpose, @RequestParam("owner") CostOwner owner) {
        CostImportEntry i = new CostImportEntry(new Date(), recipientName, purpose, -1);
        return this.uploadService.createItemFromImport(owner, i);
    }

    @RequestMapping(value = "/upload/save", method = RequestMethod.POST)
    public List<DuplicateCheckResult> saveCorrectedItems(@RequestBody UploadedItems itemsToUpload) {

        return this.uploadService.saveItems(itemsToUpload.getCorrectedItems());
    }

    private List<CostItem> createItems(List<CostImportEntry> importEntries, CostOwner costOwner) {
        List<CostItem> costItems = new ArrayList<>();
        importEntries.stream().sorted(dateComparator).forEach(i ->
                costItems.add(this.uploadService.createItemFromImport(costOwner, i))
        );

        return costItems;
    }

    private AbstractCostImporter determineReader(InputStream inputStream) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.ISO_8859_1));

        List<String> lines = readFileLines(reader);

        if (lines.get(0).startsWith("Umsatzanzeige") && lines.get(8).isEmpty()) {
            return new INGCostReader();
        } else if (lines.get(0).startsWith("Umsatzanzeige") && lines.get(8).startsWith("Saldo")) {
            logger.error("Cannot import this file, please download without Saldo");
            return null;
        } else if (lines.get(0).endsWith("235")) {
            return new DBCostReader();
        } else {
            return null;
        }
    }

    private List<String> readFileLines(BufferedReader reader) throws IOException {
        List<String> lines = new ArrayList<>();
        while (reader.ready()) {
            lines.add(reader.readLine());
        }
        return lines;
    }
}
