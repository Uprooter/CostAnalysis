package de.mischa.utils;

import org.assertj.core.api.Assertions;
import org.junit.Test;

import java.time.LocalDate;

public class DateUtilsTest {

    @Test
    public void testGetOneYearBefore() {
        LocalDate today = LocalDate.of(2020, 7, 11);
        Assertions.assertThat(DateUtils.getOneYearBefore(today).getYear()).isEqualTo(2019);
        Assertions.assertThat(DateUtils.getOneYearBefore(today).getMonthValue()).isEqualTo(7);
        Assertions.assertThat(DateUtils.getOneYearBefore(today).getDayOfMonth()).isEqualTo(1);
    }

}