package de.mischa.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TimeFrameCostEntry implements Comparable<TimeFrameCostEntry> {
    private String timeFrame;
    private double mischaAmount;
    private double gesaAmount;

    @Override
    public int compareTo(TimeFrameCostEntry o) {
        int myMonth = this.getMonth(this.timeFrame);
        int otherMonth = this.getMonth(o.getTimeFrame());

        int myYear = this.getYear(this.timeFrame);
        int otherYear = this.getYear(o.getTimeFrame());

        if (myYear > otherYear) {
            return 1;
        } else if (myYear < otherYear) {
            return -1;
        } else if (myMonth > otherMonth) {
            return 1;
        } else if (myMonth < otherMonth) {
            return -1;
        }
        return 0;
    }

    private int getYear(String monthYear) {
        if (!monthYear.isEmpty() && monthYear.contains(".")) {
            return Integer.valueOf(monthYear.substring(monthYear.indexOf('.') + 1));
        }
        return 0;
    }

    private int getMonth(String monthYear) {
        if (!monthYear.isEmpty() && monthYear.contains(".")) {
            return Integer.valueOf(monthYear.substring(0, monthYear.indexOf('.')));
        }
        return 0;
    }
}
