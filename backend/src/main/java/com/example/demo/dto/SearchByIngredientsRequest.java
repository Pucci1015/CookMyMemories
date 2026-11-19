package com.example.demo.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class SearchByIngredientsRequest {
    private List<Long> ingredientIds;
    private Integer maxTime; // 最大調理時間（分）
    private String cuisineType; // 料理の種類
}