package com.expensesplitter.models;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Splits an expense by manually entered custom amounts per member.
 * Demonstrates INHERITANCE and METHOD OVERRIDING.
 *
 * OOP Concept: INHERITANCE + POLYMORPHISM
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.models
 */
public class CustomSplit extends SplitStrategy {

    // Map of userId -> manually specified amount
    private Map<Integer, Double> customAmounts;

    /** Constructor — takes pre-defined custom amount map */
    public CustomSplit(Map<Integer, Double> customAmounts) {
        this.customAmounts = customAmounts;
    }

    /**
     * Returns the custom amount directly for each member.
     * No calculation needed — amounts are manually provided.
     *
     * @param expense  the Expense object (used for reference only)
     * @param members  list of group members
     * @return Map of userId -> custom amount
     */
    @Override
    public Map<Integer, Double> split(Expense expense, List<User> members) {
        Map<Integer, Double> result = new HashMap<>();

        for (User member : members) {
            double amount = customAmounts.getOrDefault(member.getId(), 0.0);
            result.put(member.getId(), amount);
        }

        return result;
    }

    @Override
    public String getStrategyName() {
        return "CUSTOM";
    }
}
