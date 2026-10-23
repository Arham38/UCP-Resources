package com.expensesplitter.models;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Splits an expense by custom percentages assigned to each member.
 * Total percentages must add up to 100.
 * Demonstrates INHERITANCE and METHOD OVERRIDING.
 *
 * OOP Concept: INHERITANCE + POLYMORPHISM
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.models
 */
public class PercentageSplit extends SplitStrategy {

    // Map of userId -> percentage assigned to that member
    private Map<Integer, Double> percentages;

    /** Constructor — takes pre-defined percentage map */
    public PercentageSplit(Map<Integer, Double> percentages) {
        this.percentages = percentages;
    }

    /**
     * Calculates each member's share based on their percentage.
     * Share = (percentage / 100) * totalAmount
     *
     * @param expense  the Expense to split
     * @param members  list of group members
     * @return Map of userId -> calculated amount
     */
    @Override
    public Map<Integer, Double> split(Expense expense, List<User> members) {
        Map<Integer, Double> result = new HashMap<>();

        for (User member : members) {
            double percent = percentages.getOrDefault(member.getId(), 0.0);
            double share = (percent / 100.0) * expense.getAmount();
            result.put(member.getId(), share);
        }

        return result;
    }

    @Override
    public String getStrategyName() {
        return "PERCENTAGE";
    }
}
