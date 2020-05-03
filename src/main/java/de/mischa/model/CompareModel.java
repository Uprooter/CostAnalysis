package de.mischa.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CompareModel {
    private String cluster;
    private double change;
}
