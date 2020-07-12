package de.mischa.readin;

import static org.hamcrest.CoreMatchers.is;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import org.junit.Assert;
import org.junit.Test;

import de.mischa.readin.ing.INGCostReader;

public class INGCostReaderTests {
    @Test
    public void testImporter() throws IOException {
        List<CostImportEntry> entries = new INGCostReader().read("src/test/resources/readin/ingExample.csv");
        Assert.assertThat(entries.size(), is(2));
        Assert.assertThat(entries.get(0).getAmount(), is(-155.52));
        Assert.assertThat(entries.get(1).getAmount(), is(-239.66));
    }
}
