package de.mischa.upload;

public class PurposeCleaner {

	public static String clean(String original) {
		if (original == null) {
			return null;
		}
		return original.replaceAll("//", " ").replaceAll("/", " ").replaceAll(",", "");
	}
}
