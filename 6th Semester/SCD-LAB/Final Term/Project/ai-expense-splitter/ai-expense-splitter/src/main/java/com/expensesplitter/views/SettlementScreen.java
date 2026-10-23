package com.expensesplitter.views;

import com.expensesplitter.ai.SettlementEngine;
import com.expensesplitter.dao.ExpenseDAO;
import com.expensesplitter.dao.GroupDAO;
import com.expensesplitter.dao.SettlementDAO;
import com.expensesplitter.dao.UserDAO;
import com.expensesplitter.models.Group;
import com.expensesplitter.models.Settlement;
import com.expensesplitter.models.User;
import com.expensesplitter.utils.SessionManager;
import com.expensesplitter.utils.StyleConstants;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Settlement screen for the AI-Powered Expense Splitter application.
 * Built entirely with pure JavaFX code (no FXML).
 * Uses a no-arg constructor — loads all user groups and auto-selects the first group.
 *
 * Layout Structure:
 * ─────────────────────────────────────────────────────────────────────
 * TOP HBox: title left | group ComboBox + Recalculate button right
 * SUMMARY ROW: Total Debts | Pending Amount | Settled (METRIC_CARD_STYLE)
 * TABLE: From | To | Amount | Status | Action
 * ─────────────────────────────────────────────────────────────────────
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.views
 */
public class SettlementScreen extends VBox {

    /** Group selector ComboBox */
    private ComboBox<String> groupComboBox;

    /** Total debts count label */
    private Label totalDebtsLabel;

    /** Pending amount sum label */
    private Label pendingAmountLabel;

    /** Settled count label */
    private Label settledCountLabel;

    /** Recalculate settlements button */
    private Button recalculateButton;

    /** Settlements TableView */
    private TableView<Settlement> settlementTableView;

    /** Inline error label */
    private Label errorLabel;

    /** DAO for settlement persistence */
    private final SettlementDAO settlementDAO = new SettlementDAO();

    /** DAO for group loading */
    private final GroupDAO groupDAO = new GroupDAO();

    /** DAO for checking whether group has expenses */
    private final ExpenseDAO expenseDAO = new ExpenseDAO();

    /** DAO for resolving user names */
    private final UserDAO userDAO = new UserDAO();

    /** Placeholder label shown when the settlements table is empty */
    private Label tablePlaceholder;

    /** AI engine for minimize cash flow algorithm */
    private final SettlementEngine settlementEngine = new SettlementEngine();

    /** Currently selected group */
    private Group currentGroup;

    /** Currently logged-in user */
    private final User currentUser = SessionManager.getCurrentUser();

    /** Map of group name → Group for quick lookup */
    private final Map<String, Group> groupMap = new HashMap<>();

    /**
     * No-arg constructor — builds UI, loads groups, auto-selects first group.
     */
    public SettlementScreen() {
        // Initialize error label early so populate methods can use it
        errorLabel = new Label();
        errorLabel.setStyle(StyleConstants.ERROR_LABEL_STYLE);
        errorLabel.setWrapText(true);

        // Build main scrollable container
        setPadding(new Insets(30));
        setSpacing(16);
        setStyle("-fx-background-color: " + StyleConstants.SECONDARY_COLOR + ";");

        getChildren().addAll(
                createTopHeader(),
                createSummaryCards(),
                createSettlementsTableCard(),
                errorLabel
        );
        VBox.setVgrow(getChildren().get(2), Priority.ALWAYS);

        // Load groups and auto-select the first one
        populateGroupComboBox();
        if (!groupComboBox.getItems().isEmpty()) {
            groupComboBox.getSelectionModel().selectFirst();
            handleGroupChange();
        }
    }

    /**
     * Creates the top header with title on left and group selector + recalculate on right.
     *
     * @return HBox top header row
     */
    private HBox createTopHeader() {
        HBox headerBox = new HBox(16);
        headerBox.setAlignment(Pos.CENTER_LEFT);

        // Title on the left
        Label titleLabel = new Label("💸 Settlements");
        titleLabel.setStyle(StyleConstants.HEADING_STYLE);

        // Spacer pushes controls to the right
        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        // Group selector
        Label groupLabel = new Label("Group:");
        groupLabel.setStyle("-fx-font-weight: bold; -fx-font-size: 13px; -fx-text-fill: " + StyleConstants.TEXT_PRIMARY + ";");

        groupComboBox = new ComboBox<>();
        groupComboBox.setPromptText("Select a group");
        groupComboBox.setStyle(StyleConstants.INPUT_STYLE);
        groupComboBox.setPrefWidth(220);
        groupComboBox.setOnAction(e -> handleGroupChange());

        // Recalculate button
        recalculateButton = new Button("🔄 Recalculate");
        recalculateButton.setStyle(StyleConstants.BTN_PRIMARY_STYLE);
        recalculateButton.setOnAction(e -> handleRecalculate());
        StyleConstants.applyPrimaryHover(recalculateButton);

        headerBox.getChildren().addAll(titleLabel, spacer, groupLabel, groupComboBox, recalculateButton);
        return headerBox;
    }

    /**
     * Creates the three summary metric cards.
     *
     * @return HBox containing Total Debts, Pending Amount, and Settled cards
     */
    private HBox createSummaryCards() {
        HBox cardsBox = new HBox(16);
        cardsBox.setAlignment(Pos.CENTER_LEFT);

        // Card 1: Total Debts (count, bold blue 24px)
        VBox totalDebtsCard = createMetricCard("Total Debts");
        totalDebtsLabel = new Label("0");
        totalDebtsLabel.setFont(Font.font("Arial", FontWeight.BOLD, 24));
        totalDebtsLabel.setTextFill(Color.web(StyleConstants.PRIMARY_COLOR));
        totalDebtsCard.getChildren().add(totalDebtsLabel);

        // Card 2: Pending Amount (Rs. sum, bold red 24px)
        VBox pendingCard = createMetricCard("Pending Amount");
        pendingAmountLabel = new Label("Rs. 0");
        pendingAmountLabel.setFont(Font.font("Arial", FontWeight.BOLD, 24));
        pendingAmountLabel.setTextFill(Color.web(StyleConstants.ERROR_COLOR));
        pendingCard.getChildren().add(pendingAmountLabel);

        // Card 3: Settled (count, bold green 24px)
        VBox settledCard = createMetricCard("Settled");
        settledCountLabel = new Label("0");
        settledCountLabel.setFont(Font.font("Arial", FontWeight.BOLD, 24));
        settledCountLabel.setTextFill(Color.web(StyleConstants.SUCCESS_COLOR));
        settledCard.getChildren().add(settledCountLabel);

        cardsBox.getChildren().addAll(totalDebtsCard, pendingCard, settledCard);
        return cardsBox;
    }

    /**
     * Creates a single metric card shell with a title label.
     *
     * @param title card heading text
     * @return VBox metric card container
     */
    private VBox createMetricCard(String title) {
        VBox card = new VBox(8);
        card.setStyle(StyleConstants.METRIC_CARD_STYLE);
        card.setPadding(new Insets(15));
        card.setAlignment(Pos.CENTER);
        card.setPrefWidth(200);
        Label titleLabel = new Label(title);
        titleLabel.setStyle("-fx-font-weight: bold; -fx-font-size: 12px; -fx-text-fill: " + StyleConstants.TEXT_SECONDARY + ";");
        card.getChildren().add(titleLabel);
        return card;
    }

    /**
     * Creates the settlements TableView card.
     *
     * @return VBox containing the table
     */
    private VBox createSettlementsTableCard() {
        VBox card = new VBox(10);
        card.setStyle(StyleConstants.CARD_STYLE);
        card.setPadding(new Insets(20));
        VBox.setVgrow(card, Priority.ALWAYS);

        settlementTableView = new TableView<>();
        settlementTableView.setStyle(StyleConstants.TABLE_STYLE);
        settlementTableView.setColumnResizePolicy(TableView.CONSTRAINED_RESIZE_POLICY_ALL_COLUMNS);
        settlementTableView.setPrefHeight(350);

        // From column
        TableColumn<Settlement, String> fromColumn = new TableColumn<>("From");
        fromColumn.setCellValueFactory(cell ->
                new javafx.beans.property.SimpleStringProperty(getUserName(cell.getValue().getFromUserId())));

        // To column
        TableColumn<Settlement, String> toColumn = new TableColumn<>("To");
        toColumn.setCellValueFactory(cell ->
                new javafx.beans.property.SimpleStringProperty(getUserName(cell.getValue().getToUserId())));

        // Amount column
        TableColumn<Settlement, String> amountColumn = new TableColumn<>("Amount");
        amountColumn.setCellValueFactory(cell ->
                new javafx.beans.property.SimpleStringProperty(
                        String.format("Rs. %.2f", cell.getValue().getAmount())));

        // Status column — green Settled or orange Pending
        TableColumn<Settlement, String> statusColumn = new TableColumn<>("Status");
        statusColumn.setCellValueFactory(cell ->
                new javafx.beans.property.SimpleStringProperty(
                        cell.getValue().isSettled() ? "✅ Settled" : "⏳ Pending"));
        statusColumn.setCellFactory(col -> new TableCell<Settlement, String>() {
            @Override
            protected void updateItem(String item, boolean empty) {
                super.updateItem(item, empty);
                if (empty || item == null) {
                    setText(null);
                    setStyle("");
                } else {
                    setText(item);
                    if (item.contains("Settled")) {
                        setTextFill(Color.web(StyleConstants.SUCCESS_COLOR));
                    } else {
                        setTextFill(Color.web("#E67E22"));
                    }
                }
            }
        });

        // Action column — Mark Settled button (disabled when already settled)
        TableColumn<Settlement, Void> actionColumn = new TableColumn<>("Action");
        actionColumn.setCellFactory(param -> new TableCell<Settlement, Void>() {
            private final Button markButton = new Button("Mark Settled");

            {
                markButton.setStyle(StyleConstants.BTN_PRIMARY_STYLE + " -fx-font-size: 11px; -fx-padding: 5 10;");
                StyleConstants.applyPrimaryHover(markButton);
                markButton.setOnAction(e -> {
                    Settlement settlement = getTableView().getItems().get(getIndex());
                    handleMarkSettled(settlement);
                });
            }

            @Override
            protected void updateItem(Void item, boolean empty) {
                super.updateItem(item, empty);
                if (empty) {
                    setGraphic(null);
                } else {
                    Settlement settlement = getTableView().getItems().get(getIndex());
                    markButton.setDisable(settlement.isSettled());
                    setGraphic(markButton);
                }
            }
        });

        settlementTableView.getColumns().addAll(fromColumn, toColumn, amountColumn, statusColumn, actionColumn);

        tablePlaceholder = new Label("No expenses in this group yet.");
        tablePlaceholder.setStyle("-fx-text-fill: " + StyleConstants.TEXT_SECONDARY + "; -fx-font-style: italic;");
        settlementTableView.setPlaceholder(tablePlaceholder);

        settlementTableView.setRowFactory(tv -> new TableRow<>() {
            @Override
            protected void updateItem(Settlement item, boolean empty) {
                super.updateItem(item, empty);
                if (empty || item == null) {
                    setStyle("");
                } else if (item.isSettled()) {
                    setStyle("-fx-text-fill: " + StyleConstants.TEXT_SECONDARY + ";");
                } else {
                    setStyle("");
                }
            }
        });

        card.getChildren().add(settlementTableView);
        return card;
    }

    /**
     * Loads all groups for the current user into the group ComboBox.
     */
    private void populateGroupComboBox() {
        groupComboBox.getItems().clear();
        groupMap.clear();

        if (currentUser == null) {
            return;
        }

        try {
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
     * Handles group ComboBox selection change — reloads settlements for the new group.
     */
    private void handleGroupChange() {
        String selectedName = groupComboBox.getValue();
        if (selectedName == null) {
            currentGroup = null;
            settlementTableView.getItems().clear();
            updateSummaryCards();
            return;
        }

        try {
            Group group = groupMap.get(selectedName);
            if (group != null) {
                currentGroup = groupDAO.getGroupById(group.getId());
                groupMap.put(selectedName, currentGroup);
                loadSettlements();
            }
        } catch (Exception e) {
            errorLabel.setText("Error changing group: " + e.getMessage());
        }
    }

    /**
     * Loads settlements for the current group.
     * Calculates net balances, runs minimize cash flow, saves to DB, and populates the table.
     */
    private void loadSettlements() {
        errorLabel.setText("");

        if (currentGroup == null) {
            return;
        }

        try {
            int groupId = currentGroup.getId();

            // Check if settlements already exist in the database
            List<Settlement> existing = settlementDAO.getSettlementsByGroup(groupId);

            if (existing.isEmpty()) {
                // No settlements yet — calculate net balances and save fresh settlements
                Map<Integer, Double> balances = settlementEngine.calculateNetBalances(currentGroup);
                List<Settlement> calculated = settlementEngine.calculateSettlements(currentGroup, balances);
                for (Settlement settlement : calculated) {
                    settlementDAO.saveSettlement(settlement);
                }
                existing = settlementDAO.getSettlementsByGroup(groupId);
            }

            // Populate TableView with settlement records
            settlementTableView.getItems().clear();
            settlementTableView.getItems().addAll(existing);

            // Update empty-state message based on expenses vs settlements
            updateTablePlaceholder(existing);

            // Update summary metric cards
            updateSummaryCards();

        } catch (Exception e) {
            errorLabel.setText("Error loading settlements: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Updates the three summary cards from the current TableView data.
     * Total Debts = list size, Pending Amount = sum of unsettled, Settled = settled count.
     */
    private void updateSummaryCards() {
        List<Settlement> settlements = settlementTableView.getItems();

        int totalDebts = settlements.size();
        double pendingAmount = 0.0;
        int settledCount = 0;

        for (Settlement s : settlements) {
            if (s.isSettled()) {
                settledCount++;
            } else {
                pendingAmount += s.getAmount();
            }
        }

        totalDebtsLabel.setText(String.valueOf(totalDebts));
        pendingAmountLabel.setText(String.format("Rs. %,.0f", pendingAmount));
        settledCountLabel.setText(String.valueOf(settledCount));
    }

    /**
     * Marks a settlement as settled in the database and refreshes the table.
     *
     * @param settlement the settlement to mark as paid
     */
    private void handleMarkSettled(Settlement settlement) {
        try {
            errorLabel.setText("");
            boolean success = settlementDAO.markAsSettled(settlement.getId());
            if (success) {
                // Reload table and summary cards from database
                List<Settlement> updated = settlementDAO.getSettlementsByGroup(currentGroup.getId());
                settlementTableView.getItems().clear();
                settlementTableView.getItems().addAll(updated);
                updateTablePlaceholder(updated);
                updateSummaryCards();
            } else {
                errorLabel.setText("Failed to mark settlement as settled.");
            }
        } catch (Exception e) {
            errorLabel.setText("Error marking settlement: " + e.getMessage());
        }
    }

    /**
     * Deletes existing settlements and recalculates fresh using the AI engine.
     */
    private void handleRecalculate() {
        if (currentGroup == null) {
            errorLabel.setText("Please select a group first.");
            return;
        }

        try {
            errorLabel.setText("");
            int groupId = currentGroup.getId();

            // Delete all old settlements for this group
            List<Settlement> old = settlementDAO.getSettlementsByGroup(groupId);
            for (Settlement s : old) {
                settlementDAO.deleteSettlement(s.getId());
            }

            // Recalculate and save fresh settlements using full group + members
            Map<Integer, Double> balances = settlementEngine.calculateNetBalances(currentGroup);
            List<Settlement> fresh = settlementEngine.calculateSettlements(currentGroup, balances);
            for (Settlement settlement : fresh) {
                settlementDAO.saveSettlement(settlement);
            }

            // Reload table and summary cards
            List<Settlement> updated = settlementDAO.getSettlementsByGroup(groupId);
            settlementTableView.getItems().clear();
            settlementTableView.getItems().addAll(updated);
            updateTablePlaceholder(updated);
            updateSummaryCards();

        } catch (Exception e) {
            errorLabel.setText("Error recalculating settlements: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Updates the table placeholder message depending on expenses and settlement state.
     *
     * @param settlements current settlement list for the group
     */
    private void updateTablePlaceholder(List<Settlement> settlements) {
        if (currentGroup == null || tablePlaceholder == null) {
            return;
        }
        try {
            boolean hasExpenses = !expenseDAO.getExpensesByGroup(currentGroup.getId()).isEmpty();
            if (!hasExpenses) {
                tablePlaceholder.setText("No expenses in this group yet.");
            } else if (settlements.isEmpty()) {
                tablePlaceholder.setText("No pending settlements — add more members or expenses to split.");
            } else {
                tablePlaceholder.setText("No settlements to display.");
            }
        } catch (Exception e) {
            tablePlaceholder.setText("No settlements to display.");
        }
    }

    /**
     * Resolves a user ID to a display name for the TableView.
     *
     * @param userId the user ID to look up
     * @return user name or fallback string
     */
    private String getUserName(int userId) {
        try {
            User user = userDAO.getUserById(userId);
            if (user != null) {
                return user.getName();
            }
        } catch (Exception e) {
            // Fall through to default
        }
        return "User " + userId;
    }
}
