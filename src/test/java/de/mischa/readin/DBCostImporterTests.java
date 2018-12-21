package de.mischa.readin;

import static org.hamcrest.CoreMatchers.is;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import org.junit.Assert;
import org.junit.Test;

import de.mischa.readin.db.DBCostImporter;

public class DBCostImporterTests {
	@Test
	public void testImporter() throws FileNotFoundException, IOException {
		List<CostImportEntry> entries = new DBCostImporter().read("src/test/resources/readin/dbExample.csv");
		Assert.assertThat(entries.size(), is(2));
		Assert.assertThat(entries.get(0).getAmount(), is(-117.0));
		Assert.assertThat(entries.get(1).getAmount(), is(-9.99));
	}

}