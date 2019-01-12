package de.mischa.utils;

import java.text.ParseException;
import java.util.Date;

public class DateUtils {

	public static Date createDate(String date) {
		try {
			return org.apache.commons.lang3.time.DateUtils.parseDateStrictly(date, "dd.MM.yyyy");
		} catch (ParseException e) {
			return null;
		}
	}

}
