package de.mischa.readin;

import java.io.FileNotFoundException;
import java.io.IOException;

import org.junit.Test;

public class DBCostImporterTests {
	@Test
	public void testImporter() throws FileNotFoundException, IOException {
		new DBCostImporter().read("src/test/resources/readin/example.csv")
				.forEach(e -> System.out.println(e.getAmount()));
	}

}
