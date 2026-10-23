package com.expensesplitter.views;

import com.expensesplitter.ai.MLCategoryPredictor;
import com.expensesplitter.dao.ExpenseDAO;
import com.expensesplitter.dao.GroupDAO;
import com.expensesplitter.models.*;
import com.expensesplitter.utils.InputValidator;
import com.expensesplitter.utils.SessionManager;
import com.expensesplitter.utils.StyleConstants;
import javafx.beans.property.SimpleStringProperty;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.*;
import javafx.scene.control.cell.TextFieldTableCell;
import javafx.scene.layout.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Add Expense screen for the AI-Powered Expense Splitter application.
 * Built entirely with pure JavaFX code (no FXML).
 * Uses a no-arg constructor — loads all user groups from the database on init.
 *
 * Layout Structure:
 * ─────────────────────────────────────────────────────────────────────
 * TOP: title "➕ Add New Expense" (HEADING_STYLE)
 * FORM CARD (CARD_STYLE GridPane): group, title, amount, date, payer, category
 * SPLIT CARD (CARD_STYLE): Equal / Percentage / Custom with dynamic TableView
 * BOTTOM HBox: [Cancel] [💾 Save Expense]
 * ─────────────────────────────────────────────────────────────────────
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.views
 */
public class AddExpenseScreen extends ScrollPane {

    /** Group selector ComboBox */
    private ComboBox<String> groupComboBox;

    /** Expense title input */
    private TextField titleField;

    /** Expense amount input (numeric only) */
    private TextField amountField;

    /** Expense date picker (defaults to today) */
    private DatePicker datePicker;

    /** Payer member selector */
    private ComboBox<String> payerComboBox;

    /** Category selector (auto-filled by AI) */
    private ComboBox<String> categoryComboBox;

    /** AI prediction label shown below title field */
    private Label predictedCategoryLabel;

    /** Radio button group for split type selection */
    private ToggleGroup splitTypeToggleGroup;

    /** Equal split radio button */
    private RadioButton equalRadio;

    /** Percentage split radio button */
    private RadioButton percentageRadio;

    /** Custom amount split radio button */
    private RadioButton customRadio;

    /** Dynamic split table section (hidden for Equal split) */
    private VBox dynamicSplitSection;

    /** TableView for per-member split values */
    private TableView<MemberSplitRow> memberSplitTable;

    /** Member name column */
    private TableColumn<MemberSplitRow, String> memberNameColumn;

    /** Editable value column (percentage or custom amount) */
    private TableColumn<MemberSplitRow, String> valueColumn;

    /** Save expense button */
    private Button saveButton;

    /** Cancel / clear button */
    private Button cancelButton;

    /** Inline validation error label */
    private Label errorLabel;

    /** Currently selected group with full member list */
    private Group currentGroup;

    /** Singleton ML predictor — model loaded once at app startup */
    private final MLCategoryPredictor categoryPredictor = MLCategoryPredictor.getInstance();

    /** DAO for persisting expenses */
    private final ExpenseDAO expenseDAO = new ExpenseDAO();

    /** DAO for loading user groups */
    private final GroupDAO groupDAO = new GroupDAO();

    /** Map of group name → Group object for quick lookup */
    private final Map<String, Group> groupMap = new HashMap<>();

    /** Currently logged-in user */
    private final User currentUser = SessionManager.getCurrentUser();

    /**
     * No-arg constructor — builds the UI and loads all user groups into the ComboBox.
     * Does NOT reload the ML model (singleton loaded at app startup).
     */
    public AddExpenseScreen() {
        // Build main scrollable container
        VBox mainContainer = new VBox(16);
        mainContainer.setPadding(new Insets(30));
        mainContainer.setStyle("-fx-background-color: " + StyleConstants.SECONDARY_COLOR + ";");

        // Assemble all UI sections
        mainContainer.getChildren().addAll(
                createHeaderSection(),
                createFormCard(),
                createSplitTypeCard(),
                createActionButtons()
        );

        // Configure ScrollPane
        setContent(mainContainer);
        setFitToWidth(true);
        setFitToHeight(true);
        setStyle("-fx-background-color: transparent;");

        // Load all user groups into the group ComboBox
        populateGroupsComboBox();

        // Default split type is Equal (table hidden)
        handleSplitTypeChange("EQUAL");
    }

    /**
     * Creates the header section with title.
     *
     * @return VBox containing header elements
     */
    private VBox createHeaderSection() {
        VBox header = new VBox(8);
        header.setAlignment(Pos.CENTER_LEFT);

        Label titleLabel = new Label("➕ Add New Expense");
        titleLabel.setStyle(StyleConstants.HEADING_STYLE);

        Label subtitleLabel = new Label("Fill in expense details below");
        subtitleLabel.setStyle(StyleConstants.SUBHEADING_STYLE);

        header.getChildren().addAll(titleLabel, subtitleLabel);
        return header;
    }

    /**
     * Creates the form card with group selector, title, amount, date, payer, and category fields.
     *
     * @return VBox containing the form GridPane
     */
    private VBox createFormCard() {
        VBox card = new VBox(16);
        card.setStyle(StyleConstants.CARD_STYLE);
        card.setPadding(new Insets(20));

        // Two-column GridPane: labels on left, inputs on right
        GridPane grid = new GridPane();
        grid.setHgap(15);
        grid.setVgap(12);
        grid.setAlignment(Pos.TOP_LEFT);

        // Row 0: Select Group
        Label groupLabel = new Label("Select Group");
        groupLabel.setStyle(labelStyle());
        groupComboBox = new ComboBox<>();
        groupComboBox.setPromptText("Select a group");
        groupComboBox.setStyle(StyleConstants.INPUT_STYLE);
        groupComboBox.setMaxWidth(Double.MAX_VALUE);
        groupComboBox.setOnAction(e -> handleGroupSelection());
        grid.add(groupLabel, 0, 0);
        grid.add(groupComboBox, 1, 0);

        // Row 1: Expense Title + AI prediction label
        Label titleLabel = new Label("Expense Title");
        titleLabel.setStyle(labelStyle());
        titleField = new TextField();
        titleField.setPromptText("e.g., Dinner at KFC");
        titleField.setStyle(StyleConstants.INPUT_STYLE);
        titleField.setMaxWidth(Double.MAX_VALUE);
        predictedCategoryLabel = new Label("🤖 AI Predicted: ");
        predictedCategoryLabel.setStyle("-fx-text-fill: " + StyleConstants.PRIMARY_COLOR + "; -fx-font-style: italic; -fx-font-size: 12px;");
        predictedCategoryLabel.setVisible(false);
        // AI prediction fires on every keystroke
        titleField.textProperty().addListener((obs, oldVal, newVal) -> handleTitleChange(newVal));
        VBox titleBox = new VBox(4);
        titleBox.getChildren().addAll(titleField, predictedCategoryLabel);
        grid.add(titleLabel, 0, 1);
        grid.add(titleBox, 1, 1);

        // Row 2: Amount (numeric only)
        Label amountLabel = new Label("Amount (Rs.)");
        amountLabel.setStyle(labelStyle());
        amountField = new TextField();
        amountField.setPromptText("0.00");
        amountField.setStyle(StyleConstants.INPUT_STYLE);
        amountField.setMaxWidth(Double.MAX_VALUE);
        // Only allow digits and a single decimal point
        amountField.textProperty().addListener((obs, oldVal, newVal) -> {
            if (!newVal.matches("\\d*\\.?\\d*")) {
                amountField.setText(oldVal);
            }
        });
        grid.add(amountLabel, 0, 2);
        grid.add(amountField, 1, 2);

        // Row 3: Date (defaults to today)
        Label dateLabel = new Label("Date");
        dateLabel.setStyle(labelStyle());
        datePicker = new DatePicker(LocalDate.now());
        datePicker.setStyle(StyleConstants.INPUT_STYLE);
        datePicker.setMaxWidth(Double.MAX_VALUE);
        grid.add(dateLabel, 0, 3);
        grid.add(datePicker, 1, 3);

        // Row 4: Paid By
        Label payerLabel = new Label("Paid By");
        payerLabel.setStyle(labelStyle());
        payerComboBox = new ComboBox<>();
        payerComboBox.setPromptText("Select payer");
        payerComboBox.setStyle(StyleConstants.INPUT_STYLE);
        payerComboBox.setMaxWidth(Double.MAX_VALUE);
        grid.add(payerLabel, 0, 4);
        grid.add(payerComboBox, 1, 4);

        // Row 5: Category
        Label categoryLabel = new Label("Category");
        categoryLabel.setStyle(labelStyle());
        categoryComboBox = new ComboBox<>();
        categoryComboBox.setPromptText("Select or AI-predicted category");
        categoryComboBox.setStyle(StyleConstants.INPUT_STYLE);
        categoryComboBox.setMaxWidth(Double.MAX_VALUE);
        categoryComboBox.getItems().addAll("Food", "Travel", "Utilities", "Entertainment", "Shopping", "Other");
        grid.add(categoryLabel, 0, 5);
        grid.add(categoryComboBox, 1, 5);

        // Column sizing
        ColumnConstraints col1 = new ColumnConstraints();
        col1.setPrefWidth(120);
        ColumnConstraints col2 = new ColumnConstraints();
        col2.setHgrow(Priority.ALWAYS);
        grid.getColumnConstraints().addAll(col1, col2);

        card.getChildren().add(grid);
        return card;
    }

    /**
     * Returns the standard bold label style for form field labels.
     *
     * @return inline CSS style string
     */
    private String labelStyle() {
        return "-fx-font-weight: bold; -fx-font-size: 13px; -fx-text-fill: " + StyleConstants.TEXT_PRIMARY + ";";
    }

    /**
     * Creates the split type card with radio buttons and dynamic member table.
     *
     * @return VBox containing split type controls
     */
    private VBox createSplitTypeCard() {
        VBox card = new VBox(16);
        card.setStyle(StyleConstants.CARD_STYLE);
        card.setPadding(new Insets(20));

        Label splitTypeLabel = new Label("Split Method");
        splitTypeLabel.setStyle("-fx-font-weight: bold; -fx-font-size: 14px; -fx-text-fill: " + StyleConstants.TEXT_PRIMARY + ";");

        // Three mutually exclusive split type options
        splitTypeToggleGroup = new ToggleGroup();

        equalRadio = new RadioButton("⚖ Equal");
        equalRadio.setToggleGroup(splitTypeToggleGroup);
        equalRadio.setSelected(true);
        equalRadio.setOnAction(e -> handleSplitTypeChange("EQUAL"));

        percentageRadio = new RadioButton("📊 Percentage");
        percentageRadio.setToggleGroup(splitTypeToggleGroup);
        percentageRadio.setOnAction(e -> handleSplitTypeChange("PERCENTAGE"));

        customRadio = new RadioButton("✏ Custom");
        customRadio.setToggleGroup(splitTypeToggleGroup);
        customRadio.setOnAction(e -> handleSplitTypeChange("CUSTOM"));

        HBox radioBox = new HBox(20);
        radioBox.setAlignment(Pos.CENTER_LEFT);
        radioBox.getChildren().addAll(equalRadio, percentageRadio, customRadio);

        // Dynamic table section — visible only for Percentage and Custom
        dynamicSplitSection = new VBox(10);
        dynamicSplitSection.setVisible(false);
        dynamicSplitSection.setManaged(false);
        createMemberSplitTable();
        dynamicSplitSection.getChildren().add(memberSplitTable);

        card.getChildren().addAll(splitTypeLabel, radioBox, dynamicSplitSection);
        return card;
    }

    /**
     * Creates the action buttons row aligned to the right.
     *
     * @return HBox with Cancel and Save buttons
     */
    private HBox createActionButtons() {
        HBox buttonBox = new HBox(10);
        buttonBox.setAlignment(Pos.CENTER_RIGHT);

        errorLabel = new Label();
        errorLabel.setStyle(StyleConstants.ERROR_LABEL_STYLE);
        errorLabel.setWrapText(true);
        errorLabel.setMaxWidth(400);

        cancelButton = new Button("Cancel");
        cancelButton.setStyle(StyleConstants.BTN_SECONDARY_STYLE);
        cancelButton.setOnAction(e -> handleCancel());
        StyleConstants.applySecondaryHover(cancelButton);

        saveButton = new Button("💾 Save Expense");
        saveButton.setStyle(StyleConstants.BTN_PRIMARY_STYLE);
        saveButton.setOnAction(e -> handleSaveExpense());
        StyleConstants.applyPrimaryHover(saveButton);

        buttonBox.getChildren().addAll(errorLabel, cancelButton, saveButton);
        return buttonBox;
    }

    /**
     * Loads all groups belonging to the current user into the group ComboBox.
     */
    private void populateGroupsComboBox() {
        groupComboBox.getItems().clear();
        groupMap.clear();

        if (currentUser == null) {
            return;
        }

        try {
            // Fetch all groups for the logged-in user
            List<Group> groups = groupDAO.getGroupsByUser(currentUser.getId());
            for (Group group : groups) {
                groupComboBox.getItems().add(group.getName());
                groupMap.put(group.getName(), group);
            }
        } catch (Exception e) {
            errorLabel.setText("Error loading groups: " + e.getMessage());
        }
    }

    /**
     * Handles group ComboBox selection — reloads members for payer and split table.
     */
    private void handleGroupSelection() {
        String selectedName = groupComboBox.getValue();
        if (selectedName == null) {
            currentGroup = null;
            payerComboBox.getItems().clear();
            memberSplitTable.getItems().clear();
            return;
        }

        try {
            // Reload full group with members from database
            Group group = groupMap.get(selectedName);
            if (group != null) {
                currentGroup = groupDAO.getGroupById(group.getId());
                groupMap.put(selectedName, currentGroup);
                populatePayerComboBox();

                // Refresh split table if Percentage or Custom is active
                String splitType = getSelectedSplitType();
                if ("PERCENTAGE".equals(splitType) || "CUSTOM".equals(splitType)) {
                    populateMemberSplitTable(splitType);
                }
            }
        } catch (Exception e) {
            errorLabel.setText("Error loading group members: " + e.getMessage());
        }
    }

    /**
     * Populates the payer ComboBox with member names from the selected group.
     */
    private void populatePayerComboBox() {
        payerComboBox.getItems().clear();
        if (currentGroup != null && currentGroup.getMembers() != null) {
            for (User member : currentGroup.getMembers()) {
                payerComboBox.getItems().add(member.getName() + " (" + member.getEmail() + ")");
            }
        }
    }

    /**
     * Creates the editable TableView for percentage/custom split input.
     */
    private void createMemberSplitTable() {
        memberSplitTable = new TableView<>();
        memberSplitTable.setStyle(StyleConstants.TABLE_STYLE);
        memberSplitTable.setEditable(true);
        memberSplitTable.setPrefHeight(200);

        // Member name column — non-editable
        memberNameColumn = new TableColumn<>("Member Name");
        memberNameColumn.setPrefWidth(200);
        memberNameColumn.setEditable(false);
        memberNameColumn.setCellValueFactory(cellData ->
                new SimpleStringProperty(cellData.getValue().getMemberName()));

        // Value column — editable TextField per row
        valueColumn = new TableColumn<>("Value");
        valueColumn.setPrefWidth(180);
        valueColumn.setCellValueFactory(cellData -> cellData.getValue().valueProperty());
        valueColumn.setCellFactory(TextFieldTableCell.forTableColumn());

        memberSplitTable.getColumns().addAll(memberNameColumn, valueColumn);
    }

    /**
     * Handles title field changes — calls singleton ML predictor on every keystroke.
     *
     * @param newTitle the current title text
     */
    private void handleTitleChange(String newTitle) {
        if (newTitle == null || newTitle.trim().isEmpty()) {
            predictedCategoryLabel.setVisible(false);
            return;
        }

        // Use singleton predictor — model already loaded at startup
        String predictedCategory = categoryPredictor.predictCategory(newTitle.trim());
        predictedCategoryLabel.setText("🤖 AI Predicted: " + predictedCategory);
        predictedCategoryLabel.setVisible(true);

        // Auto-select predicted category in ComboBox
        if (categoryComboBox.getItems().contains(predictedCategory)) {
            categoryComboBox.setValue(predictedCategory);
        }
    }

    /**
     * Handles split type radio button changes — shows/hides the member table.
     *
     * @param type "EQUAL", "PERCENTAGE", or "CUSTOM"
     */
    private void handleSplitTypeChange(String type) {
        if ("EQUAL".equals(type)) {
            dynamicSplitSection.setVisible(false);
            dynamicSplitSection.setManaged(false);
        } else {
            dynamicSplitSection.setVisible(true);
            dynamicSplitSection.setManaged(true);
            valueColumn.setText("PERCENTAGE".equals(type) ? "Percentage (%)" : "Amount (Rs.)");
            populateMemberSplitTable(type);
        }
    }

    /**
     * Returns the currently selected split type code.
     *
     * @return "EQUAL", "PERCENTAGE", or "CUSTOM"
     */
    private String getSelectedSplitType() {
        if (percentageRadio.isSelected()) {
            return "PERCENTAGE";
        }
        if (customRadio.isSelected()) {
            return "CUSTOM";
        }
        return "EQUAL";
    }

    /**
     * Populates the member split table with rows for each group member.
     *
     * @param type split type determining placeholder text
     */
    private void populateMemberSplitTable(String type) {
        memberSplitTable.getItems().clear();
        if (currentGroup != null && currentGroup.getMembers() != null) {
            for (User member : currentGroup.getMembers()) {
                String placeholder = "PERCENTAGE".equals(type) ? "0" : "0.00";
                memberSplitTable.getItems().add(new MemberSplitRow(member.getName(), member.getId(), placeholder));
            }
        }
    }

    /**
     * Parses and validates the amount field text.
     *
     * @return parsed amount, or -1 if invalid (error message already set)
     */
    private double parseAndValidateAmount() {
        String amountText = amountField.getText()
                .trim()
                .replace(",", "")
                .replace("Rs.", "")
                .replace(" ", "");

        if (amountText.isEmpty()) {
            errorLabel.setText("Enter an amount");
            return -1;
        }

        double amount;
        try {
            amount = Double.parseDouble(amountText);
        } catch (NumberFormatException e) {
            errorLabel.setText("Enter a valid number for amount");
            return -1;
        }

        if (amount <= 0) {
            errorLabel.setText("Amount must be greater than 0");
            return -1;
        }

        return amount;
    }

    /**
     * Validates all inputs, creates expense, applies split strategy, and saves to database.
     */
    private void handleSaveExpense() {
        errorLabel.setText("");

        // Validate amount first with robust parsing
        double amount = parseAndValidateAmount();
        if (amount < 0) {
            return;
        }

        // Run remaining field validations
        if (!validateInputs(amount)) {
            return;
        }

        try {
            // Build Expense object from form fields
            Expense expense = new Expense();
            expense.setTitle(titleField.getText().trim());
            expense.setAmount(amount);
            expense.setGroupId(currentGroup.getId());
            expense.setDate(java.sql.Date.valueOf(datePicker.getValue()));
            expense.setCategory(categoryComboBox.getValue());
            expense.setSplitType(getSelectedSplitType());
            expense.setPaidBy(extractUserIdFromSelection(payerComboBox.getValue()));

            // Polymorphic split strategy selection
            SplitStrategy strategy = createSplitStrategy(expense.getSplitType());
            strategy.split(expense, currentGroup.getMembers());

            // Persist to database
            boolean success = expenseDAO.addExpense(expense);

            if (success) {
                Alert successAlert = new Alert(Alert.AlertType.INFORMATION);
                successAlert.setTitle("Success");
                successAlert.setHeaderText("Expense saved successfully!");
                successAlert.setContentText("The expense has been saved and split among group members.");
                successAlert.showAndWait();
                clearForm();
            } else {
                errorLabel.setText("Failed to save expense. Please try again.");
            }

        } catch (Exception e) {
            errorLabel.setText("Error saving expense: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Validates all form fields with specific error messages.
     *
     * @param amount already-validated amount value
     * @return true if all inputs are valid
     */
    private boolean validateInputs(double amount) {
        if (groupComboBox.getValue() == null || currentGroup == null) {
            errorLabel.setText("Select a group first");
            return false;
        }
        if (InputValidator.isEmpty(titleField.getText())) {
            errorLabel.setText("Enter expense title");
            return false;
        }
        if (datePicker.getValue() == null) {
            errorLabel.setText("Select a date");
            return false;
        }
        if (payerComboBox.getValue() == null) {
            errorLabel.setText("Select who paid");
            return false;
        }
        if (categoryComboBox.getValue() == null) {
            errorLabel.setText("Please select a category.");
            return false;
        }

        String splitType = getSelectedSplitType();
        if ("PERCENTAGE".equals(splitType) && !validatePercentageInputs()) {
            return false;
        }
        if ("CUSTOM".equals(splitType) && !validateCustomAmountInputs(amount)) {
            return false;
        }

        return true;
    }

    /**
     * Validates that percentage values sum to exactly 100.
     *
     * @return true if percentages are valid
     */
    private boolean validatePercentageInputs() {
        double total = 0.0;
        for (MemberSplitRow row : memberSplitTable.getItems()) {
            try {
                double percent = Double.parseDouble(row.getValue().replace("%", "").trim());
                if (percent < 0 || percent > 100) {
                    errorLabel.setText("Percentage for " + row.getMemberName() + " must be between 0 and 100.");
                    return false;
                }
                total += percent;
            } catch (NumberFormatException e) {
                errorLabel.setText("Invalid percentage for " + row.getMemberName());
                return false;
            }
        }
        if (Math.abs(total - 100.0) > 0.01) {
            errorLabel.setText("Percentages must add up to 100");
            return false;
        }
        return true;
    }

    /**
     * Validates that custom amounts sum to the total expense amount.
     *
     * @return true if custom amounts are valid
     */
    private boolean validateCustomAmountInputs(double totalAmount) {
        double sum = 0.0;

        for (MemberSplitRow row : memberSplitTable.getItems()) {
            try {
                double amount = Double.parseDouble(row.getValue().replace("Rs.", "").trim());
                if (amount < 0) {
                    errorLabel.setText("Amount for " + row.getMemberName() + " cannot be negative.");
                    return false;
                }
                sum += amount;
            } catch (NumberFormatException e) {
                errorLabel.setText("Invalid amount for " + row.getMemberName());
                return false;
            }
        }

        if (Math.abs(sum - totalAmount) > 0.01) {
            errorLabel.setText("Custom amounts must equal total expense amount");
            return false;
        }
        return true;
    }

    /**
     * Creates the appropriate SplitStrategy subclass based on split type.
     * Demonstrates POLYMORPHISM — same split() call, different behavior.
     *
     * @param splitType "EQUAL", "PERCENTAGE", or "CUSTOM"
     * @return instantiated SplitStrategy
     */
    private SplitStrategy createSplitStrategy(String splitType) {
        switch (splitType) {
            case "PERCENTAGE":
                Map<Integer, Double> percentages = new HashMap<>();
                for (MemberSplitRow row : memberSplitTable.getItems()) {
                    String raw = row.getValue().replace("%", "").trim();
                    if (raw.isEmpty()) {
                        throw new IllegalArgumentException("Enter a percentage for " + row.getMemberName());
                    }
                    double percent = Double.parseDouble(raw);
                    percentages.put(row.getMemberId(), percent);
                }
                return new PercentageSplit(percentages);
            case "CUSTOM":
                Map<Integer, Double> customAmounts = new HashMap<>();
                for (MemberSplitRow row : memberSplitTable.getItems()) {
                    String raw = row.getValue().replace("Rs.", "").trim();
                    if (raw.isEmpty()) {
                        throw new IllegalArgumentException("Enter an amount for " + row.getMemberName());
                    }
                    double memberAmount = Double.parseDouble(raw);
                    customAmounts.put(row.getMemberId(), memberAmount);
                }
                return new CustomSplit(customAmounts);
            default:
                return new EqualSplit();
        }
    }

    /**
     * Extracts user ID from payer ComboBox selection string "Name (email)".
     *
     * @param selection the selected combo box value
     * @return user ID of the selected payer
     */
    private int extractUserIdFromSelection(String selection) {
        if (selection == null || currentGroup == null || currentGroup.getMembers() == null) {
            return currentUser != null ? currentUser.getId() : 0;
        }
        String email = selection.substring(selection.indexOf("(") + 1, selection.indexOf(")"));
        for (User member : currentGroup.getMembers()) {
            if (member.getEmail().equals(email)) {
                return member.getId();
            }
        }
        return currentUser != null ? currentUser.getId() : 0;
    }

    /**
     * Clears all form fields after a successful save.
     */
    private void clearForm() {
        groupComboBox.setValue(null);
        currentGroup = null;
        titleField.clear();
        amountField.clear();
        datePicker.setValue(LocalDate.now());
        payerComboBox.getItems().clear();
        payerComboBox.setValue(null);
        categoryComboBox.setValue(null);
        equalRadio.setSelected(true);
        predictedCategoryLabel.setVisible(false);
        errorLabel.setText("");
        memberSplitTable.getItems().clear();
        handleSplitTypeChange("EQUAL");
    }

    /**
     * Handles Cancel — clears the form without saving.
     */
    private void handleCancel() {
        clearForm();
    }

    /**
     * Inner class representing one row in the member split TableView.
     * Holds member name, ID, and an editable value property.
     */
    private static class MemberSplitRow {

        /** Display name of the group member */
        private final String memberName;

        /** Database ID of the group member */
        private final int memberId;

        /** Editable split value (percentage or amount) */
        private final SimpleStringProperty valueProperty;

        /**
         * Constructs a member split row.
         *
         * @param memberName   display name
         * @param memberId     user ID
         * @param initialValue starting value for the editable cell
         */
        MemberSplitRow(String memberName, int memberId, String initialValue) {
            this.memberName = memberName;
            this.memberId = memberId;
            this.valueProperty = new SimpleStringProperty(initialValue);
        }

        /**
         * @return member display name
         */
        String getMemberName() {
            return memberName;
        }

        /**
         * @return member user ID
         */
        int getMemberId() {
            return memberId;
        }

        /**
         * @return current split value as string
         */
        String getValue() {
            return valueProperty.get();
        }

        /**
         * @return editable value property for TableView binding
         */
        SimpleStringProperty valueProperty() {
            return valueProperty;
        }
    }
}
