package com.expensesplitter.utils;

import com.expensesplitter.dao.ExpenseDAO;
import javafx.geometry.Side;
import javafx.scene.chart.BarChart;
import javafx.scene.chart.CategoryAxis;
import javafx.scene.chart.NumberAxis;
import javafx.scene.chart.PieChart;
import javafx.scene.chart.XYChart;

import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.Locale;
import java.util.Map;

/**
 * Utility class for generating JavaFX charts from expense data.
 * Used by the Analytics screen.
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.utils
 */
public class ChartHelper {

    private static final String[] MONTH_LABELS = {
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    };

    private static final String[] PIE_COLORS = {
            "#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c"
    };

    /**
     * Builds a PieChart showing spending by category.
     * Tries month filter first; falls back to all-time if no data found.
     *
     * @param groupId group ID, or -1 to aggregate all groups for userId
     * @param userId  user ID (required when groupId is -1)
     * @param month   month number (1-12)
     * @param year    year (e.g. 2026)
     * @return configured PieChart ready to display
     */
    public static PieChart generatePieChart(int groupId, int userId, int month, int year) {
        PieChart pieChart = new PieChart();
        pieChart.setAnimated(false);
        pieChart.setLegendVisible(true);
        pieChart.setLegendSide(Side.BOTTOM);
        pieChart.setLabelsVisible(true);
        pieChart.setVisible(true);
        pieChart.setPrefHeight(300);
        pieChart.setMinHeight(250);

        String monthName = Month.of(month).getDisplayName(TextStyle.FULL, Locale.ENGLISH);
        pieChart.setTitle("Spending by Category - " + monthName.toUpperCase());

        ExpenseDAO expenseDAO = new ExpenseDAO();
        Map<String, Double> categoryTotals;

        try {
            // Step 1: Query with month + year filter
            if (groupId == -1) {
                categoryTotals = expenseDAO.getCategoryTotalsForUser(userId, month, year);
            } else {
                categoryTotals = expenseDAO.getCategoryTotalsByGroup(groupId, month, year);
            }

            // Step 2: Fallback — all time if month filter returns nothing
            if (categoryTotals.isEmpty()) {
                if (groupId == -1) {
                    categoryTotals = expenseDAO.getCategoryTotalsForUserAllTime(userId);
                } else {
                    categoryTotals = expenseDAO.getCategoryTotalsByGroupAllTime(groupId);
                }
                if (!categoryTotals.isEmpty()) {
                    pieChart.setTitle("Spending by Category (All Time)");
                }
            }

            // Step 3: Build pie slices
            if (categoryTotals.isEmpty()) {
                pieChart.getData().add(new PieChart.Data("No expense data available", 1));
            } else {
                for (Map.Entry<String, Double> entry : categoryTotals.entrySet()) {
                    if (entry.getValue() > 0) {
                        pieChart.getData().add(new PieChart.Data(
                                entry.getKey() + " (Rs. " + String.format("%.0f", entry.getValue()) + ")",
                                entry.getValue()));
                    }
                }
                if (pieChart.getData().isEmpty()) {
                    pieChart.getData().add(new PieChart.Data("No expense data available", 1));
                }
            }

            // Step 4: Apply slice colors after data is set
            applyPieColors(pieChart);

        } catch (Exception e) {
            System.err.println("Error generating pie chart: " + e.getMessage());
            e.printStackTrace();
            pieChart.getData().clear();
            pieChart.getData().add(new PieChart.Data("Error loading data", 1));
        }

        return pieChart;
    }

    /**
     * Backward-compatible overload — uses current year and userId for all-groups view.
     *
     * @param groupId group ID (-1 for all user groups)
     * @param month   month number (1-12)
     * @return configured PieChart
     */
    public static PieChart generatePieChart(int groupId, int month) {
        return generatePieChart(groupId, -1, month, LocalDate.now().getYear());
    }

    /**
     * Builds a BarChart showing month-wise total spending for a user in the current year.
     *
     * @param userId the user whose spending history to chart
     * @return configured BarChart ready to display
     */
    public static BarChart<String, Number> generateBarChart(int userId) {
        return generateBarChart(userId, -1);
    }

    /**
     * Builds a BarChart showing month-wise spending for a user, optionally filtered by group.
     *
     * @param userId  user whose spending to chart
     * @param groupId group ID, or -1 for all user groups
     * @return configured BarChart
     */
    public static BarChart<String, Number> generateBarChart(int userId, int groupId) {
        CategoryAxis xAxis = new CategoryAxis();
        xAxis.setLabel("Month");

        NumberAxis yAxis = new NumberAxis();
        yAxis.setLabel("Amount (Rs.)");

        BarChart<String, Number> barChart = new BarChart<>(xAxis, yAxis);
        barChart.setTitle("Monthly Spending History");
        barChart.setLegendVisible(false);
        barChart.setAnimated(false);
        barChart.setVisible(true);
        barChart.setPrefHeight(300);
        barChart.setMinHeight(250);

        ExpenseDAO expenseDAO = new ExpenseDAO();
        int currentYear = LocalDate.now().getYear();

        try {
            XYChart.Series<String, Number> series = new XYChart.Series<>();
            series.setName("Monthly Spending");

            // Query each month of the current year using getMonthlyTotal
            for (int m = 1; m <= 12; m++) {
                double total = groupId == -1
                        ? expenseDAO.getMonthlyTotal(userId, m, currentYear)
                        : expenseDAO.getMonthlyTotalByGroup(groupId, m, currentYear);
                series.getData().add(new XYChart.Data<>(MONTH_LABELS[m - 1], total));
            }

            barChart.getData().add(series);
            barChart.setStyle("-fx-bar-fill: #3498db;");

            // Highlight current month bar
            int currentMonth = LocalDate.now().getMonthValue();
            String currentLabel = MONTH_LABELS[currentMonth - 1];
            for (XYChart.Data<String, Number> data : series.getData()) {
                if (data.getXValue().equals(currentLabel) && data.getNode() != null) {
                    data.getNode().setStyle("-fx-bar-fill: #2ecc71;");
                }
            }

        } catch (Exception e) {
            System.err.println("Error generating bar chart: " + e.getMessage());
            e.printStackTrace();
            XYChart.Series<String, Number> emptySeries = new XYChart.Series<>();
            for (String label : MONTH_LABELS) {
                emptySeries.getData().add(new XYChart.Data<>(label, 0));
            }
            barChart.getData().add(emptySeries);
        }

        return barChart;
    }

    /**
     * Applies distinct colors to each pie chart slice.
     *
     * @param pieChart the chart to style
     */
    private static void applyPieColors(PieChart pieChart) {
        int colorIndex = 0;
        for (PieChart.Data data : pieChart.getData()) {
            final int idx = colorIndex;
            data.chartProperty().addListener((obs, oldChart, newChart) -> {
                if (data.getNode() != null) {
                    data.getNode().setStyle("-fx-pie-color: " + PIE_COLORS[idx % PIE_COLORS.length] + ";");
                }
            });
            if (data.getNode() != null) {
                data.getNode().setStyle("-fx-pie-color: " + PIE_COLORS[colorIndex % PIE_COLORS.length] + ";");
            }
            colorIndex++;
        }
    }
}
