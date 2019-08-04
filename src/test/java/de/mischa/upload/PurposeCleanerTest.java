package de.mischa.upload;

import org.assertj.core.api.Assertions;
import org.junit.Test;

public class PurposeCleanerTest {

	@Test
	public void testDoubleSlashes() {
		String somePurpose = "111//11/1111";

		String newPurpose = PurposeCleaner.clean(somePurpose);
		Assertions.assertThat(newPurpose).isEqualTo("111 11 1111");
	}
	
	@Test
	public void testRemoveCommas() {
		String somePurpose = "111,//11/1111";

		String newPurpose = PurposeCleaner.clean(somePurpose);
		Assertions.assertThat(newPurpose).isEqualTo("111 11 1111");
	}

}
