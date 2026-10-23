package com.expensesplitter.views;

import com.expensesplitter.dao.ExpenseDAO;
import com.expensesplitter.dao.UserDAO;
import com.expensesplitter.models.Expense;
import com.expensesplitter.models.User;
import com.expensesplitter.utils.SessionManager;
import com.expensesplitter.utils.StyleConstants;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.*;
import javafx.scene.layout.*;

import java.sql.SQLException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Search screen for the AI-Powered Expense Splitter application.
 * VBox layout with filter card, results table, and inline validation.
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.views
 */
public class SearchScreen extends VBox {

    private TextField keywordField;
    private DatePicker fromDatePicker;
    private DatePicker toDatePicker;
    private ComboBox<String> categoryComboBox;
    private TableView<Expense> expenseTableView;
    private Label resultCountLabel;
    private Label errorLabel;

    private final ExpenseDAO expenseDAO = new ExpenseDAO();
    private final UserDAO userDAO = new UserDAO();
    private final User currentUser = SessionManager.getCurrentUser();

    /**
     * Builds the search screen layout and wires event handlers.
     */
    public SearchScreen() {
        setPadding(new Insets(30));
        setSpacing(16);
        setStyle("-fx-background-color: " + StyleConstants.SECONDARY_COLOR + ";");

        Label titleLabel = new Label("🔍 Search Expenses");
        titleLabel.setStyle(StyleConstants.HEADING_STYLE);

        VBox resultsSection = createResultsSection();
        VBox.setVgrow(resultsSection, Priority.ALWAYS);

        getChildren().addAll(titleLabel, createFilterCard(), resultsSection);
    }

    /**
     * Creates the filter card with keyword, dates, category, and action buttons.
     *
     * @return filter card VBox
     */
    private VBox createFilterCard() {
        VBox card = new VBox(12);
        card.setStyle(StyleConstants.CARD_STYLE);

        GridPane grid = new GridPane();
        grid.setHgap(12);
        grid.setVgap(12);

        for (int i = 0; i < 4; i++) {
            ColumnConstraints col = new ColumnConstraints();
            col.setPercentWidth(25);
            grid.getColumnConstraints().add(col);
        }

        keywordField = new TextField();
        keywordField.setPromptText("Keyword");
        keywordField.setStyle(StyleConstants.INPUT_STYLE);
        keywordField.setMaxWidth(Double.MAX_VALUE);
        StyleConstants.applyInputFocus(keywordField);

        fromDatePicker = new DatePicker();
        fromDatePicker.setPromptText("From Date");
        fromDatePicker.setStyle(StyleConstants.INPUT_STYLE);
        fromDatePicker.setMaxWidth(Double.MAX_VALUE);

        toDatePicker = new DatePicker();
        toDatePicker.setPromptText("To Date");
        toDatePicker.setStyle(StyleConstants.INPUT_STYLE);
        toDatePicker.setMaxWidth(Double.MAX_VALUE);

        categoryComboBox = new ComboBox<>();
        categoryComboBox.setPromptText("Category");
        categoryComboBox.setStyle(StyleConstants.INPUT_STYLE);
        categoryComboBox.setMaxWidth(Double.MAX_VALUE);
        categoryComboBox.getItems().addAll(
                "All Categories", "Food", "Travel", "Utilities",
                "Entertainment", "Shopping", "Other");

        grid.add(wrapField("Keyword", keywordField), 0, 0);
        grid.add(wrapField("From Date", fromDatePicker), 1, 0);
        grid.add(wrapField("To Date", toDatePicker), 2, 0);
        grid.add(wrapField("Category", categoryComboBox), 3, 0);

        HBox buttonRow = new HBox(10);
        buttonRow.setAlignment(Pos.CENTER_RIGHT);
        Button searchButton = new Button("🔍 Search");
        searchButton.setStyle(StyleConstants.BTN_PRIMARY_STYLE);
        searchButton.setOnAction(e -> handleSearch());
        StyleConstants.applyPrimaryHover(searchButton);

        Button clearButton = new Button("✖ Clear");
        clearButton.setStyle(StyleConstants.BTN_SECONDARY_STYLE);
        clearButton.setOnAction(e -> handleClear());
        StyleConstants.applySecondaryHover(clearButton);

        buttonRow.getChildren().addAll(clearButton, searchButton);
        grid.add(buttonRow, 0, 1, 4, 1);

        errorLabel = new Label();
        errorLabel.setStyle(StyleConstants.ERROR_LABEL_STYLE);
        errorLabel.setWrapText(true);

        card.getChildren().addAll(grid, errorLabel);
        return card;
    }

    /**
     * Wraps a control with a small label for the filter grid.
     *
     * @param label   field label
     * @param control input control
     * @return labeled VBox
     */
    private VBox wrapField(String label, Control control) {
        VBox box = new VBox(4);
        Label lbl = new Label(label);
        lbl.setStyle("-fx-font-size: 12px; -fx-text-fill: " + StyleConstants.TEXT_SECONDARY + ";");
        box.getChildren().addAll(lbl, control);
        return box;
    }

    /**
     * Creates the results header and TableView with fixed column widths.
     *
     * @return results section VBox
     */
    private VBox createResultsSection() {
        VBox section = new VBox(10);

        HBox resultsHeader = new HBox();
        resultsHeader.setAlignment(Pos.CENTER_LEFT);
        Label resultsTitle = new Label("Results");
        resultsTitle.setStyle("-fx-font-weight: bold; -fx-font-size: 14px; -fx-text-fill: "
                + StyleConstants.TEXT_PRIMARY + ";");
        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);
        resultCountLabel = new Label("0 expenses found");
        resultCountLabel.setStyle("-fx-font-size: 13px; -fx-text-fill: " + StyleConstants.TEXT_SECONDARY + ";");
        resultsHeader.getChildren().addAll(resultsTitle, spacer, resultCountLabel);

        expenseTableView = new TableView<>();
        expenseTableView.setStyle(StyleConstants.TABLE_STYLE);
        expenseTableView.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY);
        VBox.setVgrow(expenseTableView, Priority.ALWAYS);

        TableColumn<Expense, String> indexCol = new TableColumn<>("#");
        indexCol.setPrefWidth(40);
        indexCol.setMaxWidth(40);
        indexCol.setMinWidth(40);
        indexCol.setCellValueFactory(data -> {
            int index = expenseTableView.getItems().indexOf(data.getValue()) + 1;
            return new javafx.beans.property.SimpleStringProperty(String.valueOf(index));
        });

        TableColumn<Expense, String> titleCol = new TableColumn<>("Title");
        titleCol.setCellValueFactory(data ->
                new javafx.beans.property.SimpleStringProperty(data.getValue().getTitle()));

        TableColumn<Expense, String> amountCol = new TableColumn<>("Amount");
        amountCol.setPrefWidth(120);
        amountCol.setCellValueFactory(data ->
                new javafx.beans.property.SimpleStringProperty(
                        String.format("Rs. %,.2f", data.getValue().getAmount())));

        TableColumn<Expense, String> categoryCol = new TableColumn<>("Category");
        categoryCol.setPrefWidth(110);
        categoryCol.setCellValueFactory(data ->
                new javafx.beans.property.SimpleStringProperty(data.getValue().getCategory()));

        TableColumn<Expense, String> paidByCol = new TableColumn<>("Paid By");
        paidByCol.setPrefWidth(110);
        paidByCol.setCellValueFactory(data -> {
            try {
                User payer = userDAO.getUserById(data.getValue().getPaidBy());
                return new javafx.beans.property.SimpleStringProperty(
                        payer != null ? payer.getName() : "Unknown");
            } catch (SQLException e) {
                return new javafx.beans.property.SimpleStringProperty("Unknown");
            }
        });

        TableColumn<Expense, String> dateCol = new TableColumn<>("Date");
        dateCol.setPrefWidth(100);
        dateCol.setCellValueFactory(data ->
                new javafx.beans.property.SimpleStringProperty(formatDate(data.getValue().getDate())));

        TableColumn<Expense, String> splitCol = new TableColumn<>("Split Type");
        splitCol.setPrefWidth(100);
        splitCol.setCellValueFactory(data ->
                new javafx.beans.property.SimpleStringProperty(data.getValue().getSplitType()));

        expenseTableView.getColumns().addAll(
                indexCol, titleCol, amountCol, categoryCol, paidByCol, dateCol, splitCol);

        Label placeholder = new Label("No expenses found. Try different search criteria.");
        placeholder.setStyle("-fx-text-fill: " + StyleConstants.TEXT_SECONDARY
                + "; -fx-font-style: italic; -fx-font-size: 14px;");
        expenseTableView.setPlaceholder(placeholder);

        section.getChildren().addAll(resultsHeader, expenseTableView);
        return section;
    }

    /**
     * Formats an expense date for table display.
     *
     * @param date expense date
     * @return formatted string
     */
    private String formatDate(java.util.Date date) {
        if (date == null) {
            return "";
        }
        LocalDate localDate = new java.sql.Date(date.getTime()).toLocalDate();
        return localDate.format(DateTimeFormatter.ofPattern("MMM dd, yyyy"));
    }

    /**
     * Runs the unified DAO search with all active filters.
     */
    private void handleSearch() {
        errorLabel.setText("");

        String keyword = keywordField.getText().trim();
        LocalDate from = fromDatePicker.getValue();
        LocalDate to = toDatePicker.getValue();
        String category = categoryComboBox.getValue();

        if (keyword.isEmpty()) {
            keyword = null;
        }
        if ("All Categories".equals(category)) {
            category = null;
        }

        if (from != null && to != null && from.isAfter(to)) {
            errorLabel.setText("From date must be before To date.");
            return;
        }

        if (currentUser == null) {
            errorLabel.setText("You must be logged in to search expenses.");
            return;
        }

        try {
            List<Expense> results = expenseDAO.searchExpenses(
                    currentUser.getId(), keyword, from, to, category);
            expenseTableView.getItems().setAll(results);
            resultCountLabel.setText(results.size() + " expenses found");
        } catch (SQLException e) {
            errorLabel.setText("Search failed: " + e.getMessage());
        }
    }

    /**
     * Clears all filters and the results table.
     */
    private void handleClear() {
        keywordField.clear();
        fromDatePicker.setValue(null);
        toDatePicker.setValue(null);
        categoryComboBox.setValue(null);
        errorLabel.setText("");
        expenseTableView.getItems().clear();
        resultCountLabel.setText("0 expenses found");
    }
}
