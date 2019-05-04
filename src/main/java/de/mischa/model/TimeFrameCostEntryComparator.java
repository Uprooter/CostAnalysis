package de.mischa.model;

import java.util.Comparator;

public class TimeFrameCostEntryComparator implements Comparator<TimeFrameCostEntry> {
    @Override
    public int compare(TimeFrameCostEntry o1, TimeFrameCostEntry o2) {
        return o1.compareTo(o2);
    }
}
