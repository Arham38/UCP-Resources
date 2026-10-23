package com.expensesplitter.models;

import java.util.List;
import java.util.Map;

/**
 * Abstract base class for all expense split strategies.
 * Demonstrates ABSTRACTION — defines the contract without implementation.
 * Subclasses: EqualSplit, PercentageSplit, CustomSplit
 *
 * OOP Concept: ABSTRACTION + INHERITANCE base
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.models
 */
public abstract class SplitStrategy {

    /**
     * Calculates how much each member owes for the given expense.
     * METHOD OVERRIDING — each subclass provides its own implementation.
     *
     * @param expense  the Expense to be split
     * @param members  list of Users in the group
     * @return Map of userId -> amount owed
     */
    public abstract Map<Integer, Double> split(Expense expense, List<User> members);

    /**
     * Returns the name of this split strategy.
     * Overridden by each subclass.
     */
    public abstract String getStrategyName();
}
