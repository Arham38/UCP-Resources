package com.expensesplitter.views;

import com.expensesplitter.ai.AnomalyDetector;
import com.expensesplitter.ai.SpendingForecaster;
import com.expensesplitter.dao.ExpenseDAO;
import com.expensesplitter.dao.GroupDAO;
import com.expensesplitter.models.Group;
import com.expensesplitter.models.User;
import com.expensesplitter.utils.ChartHelper;
import com.expensesplitter.utils.SessionManager;
import com.expensesplitter.utils.StyleConstants;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.chart.BarChart;
import javafx.scene.chart.PieChart;
import javafx.scene.control.*;
import javafx.scene.layout.*;

import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Analytics screen for the AI-Powered Expense Splitter application.
 * Metric cards, pie/bar charts, and conditional anomaly alert.
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.views
 */
public class AnalyticsScreen extends VBox {

    private ComboBox<String> monthComboBox;
    private ComboBox<String> groupComboBox;
    private Label thisMonthLabel;
    private Label forecastLabel;
    private Label averageLabel;
    private Label totalGroupsLabel;
    private VBox pieChartContainer;
    private VBox barChartContainer;
    private VBox anomalyAlertBox;
    private Label anomalyMessageLabel;

    private final ExpenseDAO expenseDAO = new ExpenseDAO();
    private final GroupDAO groupDAO = new GroupDAO();
    private final AnomalyDetector anomalyDetector = new AnomalyDetector();
    private final SpendingForecaster spendingForecaster = new SpendingForecaster();
    private final User currentUser = SessionManager.getCurrentUser();
    private final Map<String, Integer> groupNameToId = new HashMap<>();

    private int selectedMonth;
    private int selectedYear;

    /**
     * Builds analytics UI and loads initial data.
     */
    public AnalyticsScreen() {
        selectedMonth = LocalDate.now().getMonthValue();
        selectedYear = LocalDate.now().getYear();

        setPadding(new Insets(30));
        setSpacing(16);
        setStyle("-fx-background-color: " + StyleConstants.SECONDARY_COLOR + ";");

        getChildren().addAll(
                createHeader(),
                createMetricCards(),
                createChartsRow(),
                createAnomalyAlert()
        );

        populateGroupComboBox();
        loadAnalytics();
    }

    /**
     * Creates header with month/group selectors and refresh button.
     *
     * @return header HBox
     */
    private HBox createHeader() {
        HBox header = new HBox(12);
        header.setAlignment(Pos.CENTER_LEFT);

        Label titleLabel = new Label("📈 Analytics");
        titleLabel.setStyle(StyleConstants.HEADING_STYLE);

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        monthComboBox = new ComboBox<>();
        monthComboBox.setStyle(StyleConstants.INPUT_STYLE);
        monthComboBox.setPrefWidth(140);
        for (int m = 1; m <= 12; m++) {
            monthComboBox.getItems().add(
                    Month.of(m).getDisplayName(TextStyle.FULL, Locale.ENGLISH));
        }
        monthComboBox.getSelectionModel().select(selectedMonth - 1);
        monthComboBox.setOnAction(e -> loadAnalytics());

        groupComboBox = new ComboBox<>();
        groupComboBox.setStyle(StyleConstants.INPUT_STYLE);
        groupComboBox.setPrefWidth(180);
        groupComboBox.setOnAction(e -> loadAnalytics());

        Button refreshButton = new Button("🔄 Refresh");
        refreshButton.setStyle(StyleConstants.BTN_PRIMARY_STYLE);
        refreshButton.setOnAction(e -> loadAnalytics());
        StyleConstants.applyPrimaryHover(refreshButton);

        header.getChildren().addAll(titleLabel, spacer, monthComboBox, groupComboBox, refreshButton);
        return header;
    }

    /**
     * Creates four metric summary cards.
     *
     * @return metric cards HBox
     */
    private HBox createMetricCards() {
        HBox row = new HBox(16);
        row.setAlignment(Pos.CENTER_LEFT);

        thisMonthLabel = createMetricValue("Rs. 0", StyleConstants.PRIMARY_COLOR);
        forecastLabel = createMetricValue("Rs. 0", StyleConstants.SUCCESS_COLOR);
        averageLabel = createMetricValue("Rs. 0", StyleConstants.TEXT_SECONDARY);
        totalGroupsLabel = createMetricValue("0", StyleConstants.DARK_COLOR);

        row.getChildren().addAll(
                buildMetricCard("This Month", thisMonthLabel),
                buildMetricCard("Next Month Forecast", forecastLabel),
                buildMetricCard("6-Month Average", averageLabel),
                buildMetricCard("Total Groups", totalGroupsLabel)
        );
        return row;
    }

    /**
     * Builds a single metric card shell.
     *
     * @param title metric title
     * @param value value label
     * @return metric card VBox
     */
    private VBox buildMetricCard(String title, Label value) {
        VBox card = new VBox(8);
        card.setStyle(StyleConstants.METRIC_CARD_STYLE);
        card.setAlignment(Pos.CENTER_LEFT);
        HBox.setHgrow(card, Priority.ALWAYS);

        Label titleLabel = new Label(title);
        titleLabel.setStyle("-fx-font-weight: bold; -fx-font-size: 12px; -fx-text-fill: "
                + StyleConstants.TEXT_SECONDARY + ";");
        card.getChildren().addAll(titleLabel, value);
        return card;
    }

    /**
     * Creates a bold 24px metric value label.
     *
     * @param text  initial text
     * @param color hex color
     * @return styled label
     */
    private Label createMetricValue(String text, String color) {
        Label label = new Label(text);
        label.setStyle("-fx-font-size: 24px; -fx-font-weight: bold; -fx-text-fill: " + color + ";");
        return label;
    }

    /**
     * Creates side-by-side pie and bar chart panels.
     *
     * @return charts HBox
     */
    private HBox createChartsRow() {
        HBox row = new HBox(16);
        row.setAlignment(Pos.TOP_CENTER);
        VBox.setVgrow(row, Priority.ALWAYS);

        pieChartContainer = new VBox();
        pieChartContainer.setAlignment(Pos.CENTER);
        pieChartContainer.setMinHeight(280);
        pieChartContainer.setPrefHeight(280);

        barChartContainer = new VBox();
        barChartContainer.setAlignment(Pos.CENTER);
        barChartContainer.setMinHeight(280);
        barChartContainer.setPrefHeight(280);

        VBox pieCard = wrapChartCard("Spending by Category", pieChartContainer);
        VBox barCard = wrapChartCard("Monthly Spending Trend", barChartContainer);
        HBox.setHgrow(pieCard, Priority.ALWAYS);
        HBox.setHgrow(barCard, Priority.ALWAYS);
        pieCard.setMaxWidth(Double.MAX_VALUE);
        barCard.setMaxWidth(Double.MAX_VALUE);

        row.getChildren().addAll(pieCard, barCard);
        return row;
    }

    /**
     * Wraps a chart container in a styled card with title.
     *
     * @param title     chart title
     * @param container chart host VBox
     * @return card VBox
     */
    private VBox wrapChartCard(String title, VBox container) {
        VBox card = new VBox(12);
        card.setStyle(StyleConstants.CARD_STYLE);
        Label titleLabel = new Label(title);
        titleLabel.setStyle("-fx-font-weight: bold; -fx-font-size: 14px; -fx-text-fill: "
                + StyleConstants.TEXT_PRIMARY + ";");
        card.getChildren().addAll(titleLabel, container);
        return card;
    }

    /**
     * Creates the conditional anomaly alert panel (hidden by default).
     *
     * @return anomaly alert VBox
     */
    private VBox createAnomalyAlert() {
        anomalyAlertBox = new VBox();
        anomalyAlertBox.setVisible(false);
        anomalyAlertBox.setManaged(false);

        HBox alertContent = new HBox(12);
        alertContent.setAlignment(Pos.CENTER_LEFT);
        alertContent.setStyle(StyleConstants.ANOMALY_ALERT_STYLE);

        Label icon = new Label("⚠");
        icon.setStyle("-fx-font-size: 24px; -fx-text-fill: " + StyleConstants.ERROR_COLOR + ";");

        VBox textBox = new VBox(4);
        Label alertTitle = new Label("Spending Anomaly Detected");
        alertTitle.setStyle("-fx-font-weight: bold; -fx-font-size: 14px; -fx-text-fill: "
                + StyleConstants.ERROR_COLOR + ";");
        anomalyMessageLabel = new Label();
        anomalyMessageLabel.setStyle("-fx-font-size: 12px; -fx-text-fill: " + StyleConstants.TEXT_SECONDARY + ";");
        anomalyMessageLabel.setWrapText(true);
        textBox.getChildren().addAll(alertTitle, anomalyMessageLabel);

        alertContent.getChildren().addAll(icon, textBox);
        anomalyAlertBox.getChildren().add(alertContent);
        return anomalyAlertBox;
    }

    /**
     * Loads user groups into the group selector ComboBox.
     */
    private void populateGroupComboBox() {
        groupComboBox.getItems().clear();
        groupNameToId.clear();
        groupComboBox.getItems().add("All Groups");
        groupNameToId.put("All Groups", -1);

        if (currentUser == null) {
            return;
        }

        try {
            List<Group> groups = groupDAO.getGroupsByUser(currentUser.getId());
            for (Group group : groups) {
                groupComboBox.getItems().add(group.getName());
                groupNameToId.put(group.getName(), group.getId());
            }
            groupComboBox.getSelectionModel().selectFirst();
        } catch (Exception e) {
            groupComboBox.getSelectionModel().selectFirst();
        }
    }

    /**
     * Reloads metric cards, charts, and anomaly status.
     */
    private void loadAnalytics() {
        if (currentUser == null) {
            return;
        }

        try {
            int monthIndex = monthComboBox.getSelectionModel().getSelectedIndex();
            if (monthIndex >= 0) {
                selectedMonth = monthIndex + 1;
            }
            selectedYear = LocalDate.now().getYear();

            int userId = currentUser.getId();
            int groupId = resolveSelectedGroupId();

            double thisMonth = groupId == -1
                    ? expenseDAO.getMonthlyTotal(userId, selectedMonth, selectedYear)
                    : expenseDAO.getMonthlyTotalByGroup(groupId, selectedMonth, selectedYear);
            thisMonthLabel.setText(String.format("Rs. %,.0f", thisMonth));

            double forecast = spendingForecaster.forecastNextMonth(userId);
            forecastLabel.setText(String.format("Rs. %,.0f", forecast));

            double sixMonthAvg = calculateSixMonthAverage(userId, groupId);
            averageLabel.setText(String.format("Rs. %,.0f", sixMonthAvg));

            int groupCount = groupDAO.getGroupsByUser(userId).size();
            totalGroupsLabel.setText(String.valueOf(groupCount));

            refreshCharts(userId, groupId);
            refreshAnomaly(userId);

        } catch (Exception e) {
            anomalyMessageLabel.setText("Error loading analytics: " + e.getMessage());
            anomalyAlertBox.setVisible(true);
            anomalyAlertBox.setManaged(true);
        }
    }

    /**
     * Resolves the selected group ID from the group ComboBox.
     *
     * @return group ID or -1 for all groups
     */
    private int resolveSelectedGroupId() {
        String selected = groupComboBox.getValue();
        if (selected == null) {
            return -1;
        }
        return groupNameToId.getOrDefault(selected, -1);
    }

    /**
     * Calculates the 6-month average spending for user or group scope.
     *
     * @param userId  user ID
     * @param groupId group ID or -1
     * @return average monthly total
     */
    private double calculateSixMonthAverage(int userId, int groupId) throws Exception {
        YearMonth anchor = YearMonth.of(selectedYear, selectedMonth);
        double sum = 0;
        for (int i = 0; i < 6; i++) {
            YearMonth ym = anchor.minusMonths(i);
            sum += groupId == -1
                    ? expenseDAO.getMonthlyTotal(userId, ym.getMonthValue(), ym.getYear())
                    : expenseDAO.getMonthlyTotalByGroup(groupId, ym.getMonthValue(), ym.getYear());
        }
        return sum / 6.0;
    }

    /**
     * Refreshes pie and bar charts, showing placeholders when no data exists.
     *
     * @param userId  user ID
     * @param groupId group ID or -1
     */
    private void refreshCharts(int userId, int groupId) {
        pieChartContainer.getChildren().clear();
        PieChart pie = ChartHelper.generatePieChart(groupId, userId, selectedMonth, selectedYear);
        pie.setPrefHeight(280);
        pie.setLegendSide(javafx.geometry.Side.BOTTOM);
        if (pie.getData().size() == 1 && pie.getData().get(0).getName().contains("No expense")) {
            pieChartContainer.getChildren().add(noDataLabel());
        } else {
            pieChartContainer.getChildren().add(pie);
        }

        barChartContainer.getChildren().clear();
        BarChart<String, Number> bar = ChartHelper.generateBarChart(userId, groupId);
        bar.setPrefHeight(280);
        bar.setTitle(null);
        boolean allZero = bar.getData().isEmpty() || bar.getData().get(0).getData().stream()
                .allMatch(d -> d.getYValue().doubleValue() == 0);
        if (allZero) {
            barChartContainer.getChildren().add(noDataLabel());
        } else {
            barChartContainer.getChildren().add(bar);
        }
    }

    /**
     * Creates a centered "No data available" placeholder label.
     *
     * @return placeholder label
     */
    private Label noDataLabel() {
        Label label = new Label("No data available");
        label.setStyle("-fx-text-fill: " + StyleConstants.TEXT_SECONDARY
                + "; -fx-font-style: italic; -fx-font-size: 14px;");
        return label;
    }

    /**
     * Shows or hides the anomaly alert based on detector result.
     *
     * @param userId current user ID
     */
    private void refreshAnomaly(int userId) {
        boolean anomaly = anomalyDetector.hasAnomaly(userId, selectedMonth, selectedYear);
        if (anomaly) {
            String message = anomalyDetector.getAnomalyMessage(userId, selectedMonth, selectedYear);
            anomalyMessageLabel.setText(message != null ? message : "Unusual spending detected this month.");
            anomalyAlertBox.setVisible(true);
            anomalyAlertBox.setManaged(true);
        } else {
            anomalyAlertBox.setVisible(false);
            anomalyAlertBox.setManaged(false);
        }
    }
}
