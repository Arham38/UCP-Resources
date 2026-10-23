package com.expensesplitter.ai;

import com.expensesplitter.dao.ExpenseDAO;

import java.time.LocalDate;
import java.time.YearMonth;

/**
 * AI Module: Detects abnormal spending patterns using statistical analysis.
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.ai
 */
public class AnomalyDetector {

    private static final double ANOMALY_THRESHOLD = 1.5;
    private static final int HISTORY_MONTHS = 6;

    private final ExpenseDAO expenseDAO = new ExpenseDAO();

    /**
     * Checks if the given month's spending is abnormally high.
     *
     * @param userId user to evaluate
     * @param month  month (1-12)
     * @param year   year
     * @return true when current spending exceeds 1.5× the 6-month average
     */
    public boolean detectAnomaly(int userId, int month, int year) {
        try {
            double current = expenseDAO.getMonthlyTotal(userId, month, year);
            double average = getHistoricalAverage(userId, month, year);
            return average > 0 && current > average * ANOMALY_THRESHOLD;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Alias for {@link #detectAnomaly(int, int, int)} used by the analytics UI.
     *
     * @param userId user to evaluate
     * @param month  month (1-12)
     * @param year   year
     * @return true when an anomaly is detected
     */
    public boolean hasAnomaly(int userId, int month, int year) {
        return detectAnomaly(userId, month, year);
    }

    /**
     * Returns a human-readable anomaly message when spending is abnormally high.
     *
     * @param userId user to evaluate
     * @param month  month (1-12)
     * @param year   year
     * @return alert message, or null if no anomaly
     */
    public String getAnomalyMessage(int userId, int month, int year) {
        if (!detectAnomaly(userId, month, year)) {
            return null;
        }
        try {
            double current = expenseDAO.getMonthlyTotal(userId, month, year);
            double average = getHistoricalAverage(userId, month, year);
            return String.format(
                    "Your spending this month (Rs. %,.0f) is significantly higher than your "
                            + "6-month average (Rs. %,.0f).",
                    current, average);
        } catch (Exception e) {
            return "Your spending this month is significantly higher than your average.";
        }
    }

    /**
     * Calculates the average monthly spending over the prior HISTORY_MONTHS months.
     *
     * @param userId      user ID
     * @param anchorMonth anchor month
     * @param anchorYear  anchor year
     * @return average monthly total
     */
    private double getHistoricalAverage(int userId, int anchorMonth, int anchorYear) throws Exception {
        YearMonth anchor = YearMonth.of(anchorYear, anchorMonth);
        double sum = 0;
        int count = 0;

        for (int i = 1; i <= HISTORY_MONTHS; i++) {
            YearMonth prior = anchor.minusMonths(i);
            double total = expenseDAO.getMonthlyTotal(userId, prior.getMonthValue(), prior.getYear());
            sum += total;
            count++;
        }
        return count > 0 ? sum / count : 0;
    }
}
