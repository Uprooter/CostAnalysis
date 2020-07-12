package de.mischa.utils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Locale;


public class DateUtils {

    public static final DateTimeFormatter FORMAT = DateTimeFormatter.ofPattern("dd.MM.yyyy", Locale.GERMAN);

    public static LocalDate createDate(String date) {
        try {
            return LocalDate.parse(date, FORMAT);
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    public static boolean isDate(String date) {
        return createDate(date) != null;
    }


    public static LocalDate getOneYearBefore(LocalDate date) {
        return date.minusYears(1).withDayOfMonth(1);
    }
}
