package de.mischa.utils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;


public class DateUtils
{

   public static final DateTimeFormatter FORMAT = DateTimeFormatter.ofPattern("dd.MM.yyyy");

   public static LocalDate createDate(String date)
   {
      try
      {
         return LocalDate.parse(date, FORMAT);
      }
      catch (DateTimeParseException e)
      {
         return null;
      }
   }

}
