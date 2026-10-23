package com.expensesplitter.ai;

import com.expensesplitter.dao.ExpenseDAO;

import java.time.LocalDate;
import java.time.YearMonth;

/**
 * AI Module: Predicts next month's spending using historical averages.
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.ai
 */
public class SpendingForecaster {

    private static final int HISTORY_MONTHS = 6;
    private final ExpenseDAO expenseDAO = new ExpenseDAO();

    /**
     * Forecasts next month's estimated spending for a user.
     * Uses the average of the past 6 months as the prediction baseline.
     *
     * @param userId user whose history to analyse
     * @return estimated spending for next month
     */
    public double forecastNextMonth(int userId) {
        try {
            LocalDate now = LocalDate.now();
            YearMonth anchor = YearMonth.from(now);
            double sum = 0;
            int count = 0;

            for (int i = 0; i < HISTORY_MONTHS; i++) {
                YearMonth month = anchor.minusMonths(i);
                sum += expenseDAO.getMonthlyTotal(userId, month.getMonthValue(), month.getYear());
                count++;
            }
            return count > 0 ? sum / count : 0.0;
        } catch (Exception e) {
            return 0.0;
        }
    }
}
