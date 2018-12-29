package de.mischa.readin;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.Test;

import de.mischa.model.CostCluster;
import de.mischa.model.CostOwner;
import de.mischa.model.CostType;
import de.mischa.readin.init.InitialCostImportEntry;
import de.mischa.readin.init.InitialCostReader;

public class InitCostReaderTests {
	@Test
	public void testImporter() throws FileNotFoundException, IOException {
		List<InitialCostImportEntry> entries = new InitialCostReader().read("src/test/resources/readin/initImport.csv");
		Assertions.assertThat(entries.get(0).getOwner()).isEqualTo(CostOwner.GESA);
		Assertions.assertThat(entries.get(0).getType()).isEqualTo(CostType.FLEXIBEL);
		Assertions.assertThat(entries.get(0).getCluster()).isEqualTo(CostCluster.VERPFLEGUNG);
		Assertions.assertThat(entries.get(1).getOwner()).isEqualTo(CostOwner.MISCHA);
		Assertions.assertThat(entries.get(1).getType()).isEqualTo(CostType.FEST);
		Assertions.assertThat(entries.get(1).getCluster()).isEqualTo(CostCluster.UNTERHALTUNG);
	}
}
