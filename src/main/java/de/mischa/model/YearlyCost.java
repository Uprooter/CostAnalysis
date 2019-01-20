package de.mischa.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class YearlyCost {
    private int year;
    private double mischaAmount;
    private double gesaAmount;
}
