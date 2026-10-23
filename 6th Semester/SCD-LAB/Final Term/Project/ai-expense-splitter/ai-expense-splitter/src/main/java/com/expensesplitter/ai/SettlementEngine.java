package com.expensesplitter.ai;

import com.expensesplitter.dao.ExpenseDAO;
import com.expensesplitter.dao.GroupDAO;
import com.expensesplitter.models.Expense;
import com.expensesplitter.models.EqualSplit;
import com.expensesplitter.models.Group;
import com.expensesplitter.models.Settlement;
import com.expensesplitter.models.SplitStrategy;
import com.expensesplitter.models.User;

import java.util.*;

/**
 * Core AI module that calculates the minimum number of transactions
 * needed to settle all debts within a group.
 *
 * Algorithm: Minimize Cash Flow (Graph-based Greedy Approach)
 * ─────────────────────────────────────────────────────────────
 * 1. Calculate net balance for each member (paid - owed)
 * 2. Separate into creditors (positive balance) and debtors (negative)
 * 3. Greedily match the largest creditor with the largest debtor
 * 4. Repeat until all balances are zero
 *
 * This produces the MINIMUM number of transactions to clear all debts.
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.ai
 */
public class SettlementEngine {

    /** DAO for loading group expenses */
    private final ExpenseDAO expenseDAO;

    /** DAO for loading group members */
    private final GroupDAO groupDAO;

    /**
     * Constructor — initializes DAOs for data access.
     */
    public SettlementEngine() {
        this.expenseDAO = new ExpenseDAO();
        this.groupDAO = new GroupDAO();
    }

    /**
     * Calculates net balances for a group by ID.
     * Loads the full group (with members) then delegates to {@link #calculateNetBalances(Group)}.
     *
     * @param groupId the group to calculate balances for
     * @return Map of userId → net balance (positive = creditor, negative = debtor)
     */
    public Map<Integer, Double> calculateNetBalances(int groupId) {
        try {
            Group group = groupDAO.getGroupById(groupId);
            if (group == null) {
                return new HashMap<>();
            }
            return calculateNetBalances(group);
        } catch (Exception e) {
            System.err.println("Error loading group for balance calculation: " + e.getMessage());
            e.printStackTrace();
            return new HashMap<>();
        }
    }

    /**
     * Calculates the net balance for each group member.
     * Net balance = total paid by member − total owed by member.
     *
     * For each expense:
     * 1. Credit the payer with the full expense amount
     * 2. Debit each member with their share (Equal split among all members)
     *
     * @param group the group with members loaded
     * @return Map of userId → net balance (positive = creditor, negative = debtor)
     */
    public Map<Integer, Double> calculateNetBalances(Group group) {
        Map<Integer, Double> netBalances = new HashMap<>();

        if (group == null || group.getMembers() == null || group.getMembers().isEmpty()) {
            return netBalances;
        }

        List<User> members = group.getMembers();

        try {
            // Fetch all expenses for this group
            List<Expense> expenses = expenseDAO.getExpensesByGroup(group.getId());

            // Process each expense — credit payer, debit each member's share
            for (Expense expense : expenses) {
                // Step 1: Credit the payer (they paid the full amount upfront)
                int payerId = expense.getPaidBy();
                netBalances.put(payerId, netBalances.getOrDefault(payerId, 0.0) + expense.getAmount());

                // Step 2: Debit each member their share using the appropriate split strategy
                SplitStrategy strategy = resolveSplitStrategy(expense);
                Map<Integer, Double> shares = strategy.split(expense, members);

                for (Map.Entry<Integer, Double> share : shares.entrySet()) {
                    int memberId = share.getKey();
                    double owedAmount = share.getValue();
                    netBalances.put(memberId, netBalances.getOrDefault(memberId, 0.0) - owedAmount);
                }
            }

        } catch (Exception e) {
            System.err.println("Error calculating net balances: " + e.getMessage());
            e.printStackTrace();
        }

        return netBalances;
    }

    /**
     * Resolves the split strategy for an expense.
     * PERCENTAGE/CUSTOM per-member values are not stored in the DB,
     * so Equal split is used as the recalculation default for all types.
     *
     * @param expense the expense record
     * @return SplitStrategy to use for balance calculation
     */
    private SplitStrategy resolveSplitStrategy(Expense expense) {
        // Equal split is the reliable default when recalculating from stored expenses
        return new EqualSplit();
    }

    /**
     * Calculates minimum transactions to settle all debts in a group.
     * Uses the Minimize Cash Flow greedy algorithm with PriorityQueue.
     *
     * @param group       the expense group
     * @param netBalances Map of userId → net balance (positive = owed TO them, negative = they OWE)
     * @return list of Settlement objects representing required transactions
     */
    public List<Settlement> calculateSettlements(Group group, Map<Integer, Double> netBalances) {
        List<Settlement> settlements = new ArrayList<>();

        // Max-heap for creditors (largest positive balance first)
        PriorityQueue<Map.Entry<Integer, Double>> creditors = new PriorityQueue<>(
                (a, b) -> Double.compare(b.getValue(), a.getValue())
        );
        // Min-heap for debtors (most negative balance first)
        PriorityQueue<Map.Entry<Integer, Double>> debtors = new PriorityQueue<>(
                (a, b) -> Double.compare(a.getValue(), b.getValue())
        );

        // Separate members into creditors and debtors
        for (Map.Entry<Integer, Double> entry : netBalances.entrySet()) {
            double balance = entry.getValue();
            if (Math.abs(balance) < 0.01) {
                continue;
            }
            if (balance > 0) {
                creditors.offer(entry);
            } else {
                debtors.offer(entry);
            }
        }

        // Greedy match: largest creditor pays off largest debtor
        while (!creditors.isEmpty() && !debtors.isEmpty()) {
            Map.Entry<Integer, Double> creditor = creditors.poll();
            Map.Entry<Integer, Double> debtor = debtors.poll();

            int creditorId = creditor.getKey();
            int debtorId = debtor.getKey();
            double creditorAmount = creditor.getValue();
            double debtorAmount = Math.abs(debtor.getValue());

            double settlementAmount = Math.min(creditorAmount, debtorAmount);

            Settlement settlement = new Settlement(group.getId(), debtorId, creditorId, settlementAmount);
            settlements.add(settlement);

            double remainingCreditor = creditorAmount - settlementAmount;
            double remainingDebtor = debtorAmount - settlementAmount;

            if (remainingCreditor > 0.01) {
                creditors.offer(new AbstractMap.SimpleEntry<>(creditorId, remainingCreditor));
            }
            if (remainingDebtor > 0.01) {
                debtors.offer(new AbstractMap.SimpleEntry<>(debtorId, -remainingDebtor));
            }
        }

        return settlements;
    }
}
