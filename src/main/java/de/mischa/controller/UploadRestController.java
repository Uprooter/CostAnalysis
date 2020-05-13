package de.mischa.controller;

import de.mischa.model.CostItem;
import de.mischa.model.CostOwner;
import de.mischa.model.DuplicateCheckResult;
import de.mischa.model.UploadedItems;
import de.mischa.readin.AbstractCostImporter;
import de.mischa.readin.CostImportEntry;
import de.mischa.readin.db.DBCostReader;
import de.mischa.readin.ing.INGCostReader;
import de.mischa.readin.ing.INGCostReaderWithSaldo;
import de.mischa.upload.UploadException;
import de.mischa.upload.UploadService;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
public class UploadRestController
{

   @Autowired
   private UploadService uploadService;

   private Comparator<CostImportEntry> dateComparator = Comparator.comparing(CostImportEntry::getDate);

   private static final Logger logger = LoggerFactory.getLogger(UploadRestController.class);

   @PostMapping(value = "/upload")
   public List<CostItem> uploadNewItems(@RequestParam("file") MultipartFile file) throws UploadException
   {
      try
      {
         InputStream stream = getCleanedInputStream(file);

         AbstractCostImporter reader = this.determineReader(stream);

         return this.createItems(reader.read(getCleanedInputStream(file)), reader.getCostOwner());
      }
      catch (IOException e)
      {
         logger.info(e.getLocalizedMessage());
      }
      return new ArrayList<>();
   }

   /**
    * If file contains 2 times 'Währung' then replace the first one with 'FX' in order to be able to parse the CSV.
    *
    * @param file The file to be cleaned
    * @return Input stream without duplicate 'Währung' entries.
    * @throws IOException
    */
   private InputStream getCleanedInputStream(@RequestParam("file") MultipartFile file) throws IOException
   {
      File tempFile = File.createTempFile("costimport", ".csv");
      FileUtils.copyInputStreamToFile(file.getInputStream(), tempFile);
      String fileContent = FileUtils.readFileToString(tempFile, StandardCharsets.ISO_8859_1);
      String modifiedFileContent = fileContent.replaceFirst("Währung", "FX");
      return new ByteArrayInputStream(modifiedFileContent.getBytes(StandardCharsets.ISO_8859_1));
   }

   @PostMapping(value = "/upload/single")
   public CostItem uploadSingleItem(@RequestParam("recipientName") String recipientName,
         @RequestParam("purpose") String purpose, @RequestParam("owner") CostOwner owner)
   {
      CostImportEntry i = new CostImportEntry(LocalDate.now(), recipientName, purpose, -1);
      return this.uploadService.createItemFromImport(owner, i);
   }

   @PostMapping(value = "/upload/save")
   public List<DuplicateCheckResult> saveCorrectedItems(@RequestBody UploadedItems itemsToUpload)
   {
      return this.uploadService.saveItems(itemsToUpload.getCorrectedItems());
   }

   private List<CostItem> createItems(List<CostImportEntry> importEntries, CostOwner costOwner)
   {
      List<CostItem> costItems = new ArrayList<>();
      importEntries.stream().sorted(dateComparator).forEach(i ->
            costItems.add(this.uploadService.createItemFromImport(costOwner, i))
      );

      return costItems;
   }

   private AbstractCostImporter determineReader(InputStream inputStream) throws IOException, UploadException
   {
      BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.ISO_8859_1));

      List<String> lines = readFileLines(reader);

      if (lines.get(0).startsWith("Umsatzanzeige") && lines.get(8).isEmpty())
      {
         return new INGCostReader();
      }
      else if (lines.get(0).startsWith("Umsatzanzeige") && lines.get(8).startsWith("Saldo"))
      {
         return new INGCostReaderWithSaldo();
      }
      else if (lines.get(0).endsWith("235"))
      {
         return new DBCostReader();
      }
      else
      {
         throw new UploadException("Unexpected file format", "1");
      }
   }

   private List<String> readFileLines(BufferedReader reader) throws IOException
   {
      List<String> lines = new ArrayList<>();
      while (reader.ready())
      {
         lines.add(reader.readLine());
      }
      return lines;
   }
}
