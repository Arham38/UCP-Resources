package com.expensesplitter.models;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Splits an expense equally among all group members.
 * Demonstrates INHERITANCE (extends SplitStrategy) and METHOD OVERRIDING.
 *
 * OOP Concept: INHERITANCE + POLYMORPHISM
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.models
 */
public class EqualSplit extends SplitStrategy {

    /**
     * Divides expense amount equally among all members.
     * Each member owes: totalAmount / numberOfMembers
     *
     * @param expense  the Expense to split
     * @param members  list of all group members
     * @return Map of userId -> equal share amount
     */
    @Override
    public Map<Integer, Double> split(Expense expense, List<User> members) {
        Map<Integer, Double> result = new HashMap<>();

        if (members == null || members.isEmpty()) return result;

        // Calculate equal share per member
        double sharePerMember = expense.getAmount() / members.size();

        // Assign same share to every member
        for (User member : members) {
            result.put(member.getId(), sharePerMember);
        }

        return result;
    }

    @Override
    public String getStrategyName() {
        return "EQUAL";
    }
}
