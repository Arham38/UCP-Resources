package com.expensesplitter.views;

import com.expensesplitter.dao.ExpenseDAO;
import com.expensesplitter.dao.GroupDAO;
import com.expensesplitter.models.Expense;
import com.expensesplitter.models.Group;
import com.expensesplitter.models.User;
import com.expensesplitter.utils.SessionManager;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.*;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

import java.util.List;

/**
 * @deprecated This class is no longer used.
 * Replaced by DashboardScreen.java
 * Safe to delete before final submission.
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.views
 */
@Deprecated
public class ExpenseManagementScreen extends BorderPane {

    /** UI Components */
    private ListView<String> expenseListView;
    private ListView<String> groupFilterListView;
    private Label selectedExpenseLabel;
    private Label expenseDetailsLabel;
    private Label errorLabel;

    /** Data Access Objects */
    private ExpenseDAO expenseDAO;
    private GroupDAO groupDAO;

    /** Currently selected expense */
    private Expense selectedExpense;

    /** Currently selected group for filtering */
    private Group selectedGroup;

    /** Currently logged-in user */
    private User currentUser;

    /** List of all user's groups */
    private List<Group> userGroups;

    /**
     * Constructor - builds the entire expense management UI programmatically.
     * Creates a split layout with expense list on left and details on right.
     */
    public ExpenseManagementScreen() {
        // Initialize DAOs
        expenseDAO = new ExpenseDAO();
        groupDAO = new GroupDAO();

        // Get current logged-in user
        currentUser = SessionManager.getCurrentUser();

        // Create the main layout
        this.setStyle("-fx-background-color: #f0f2f5;");

        // Create left panel (expense list)
        VBox leftPanel = createLeftPanel();

        // Create right panel (expense details)
        VBox rightPanel = createRightPanel();

        // Set panels in BorderPane
        this.setLeft(leftPanel);
        this.setRight(rightPanel);

        // Load initial data
        loadUserGroups();
        refreshExpenseList();
    }

    /**
     * Creates the left panel containing the expense list and group filter.
     *
     * @return VBox with expense ListView and group filter
     */
    private VBox createLeftPanel() {
        VBox panel = new VBox(10);
        panel.setPadding(new Insets(20));
        panel.setStyle("-fx-background-color: white; " +
                      "-fx-border-color: #bdc3c7; " +
                      "-fx-border-width: 0 1 0 0;");
        panel.setPrefWidth(350);

        // Title label
        Label titleLabel = new Label("My Expenses");
        titleLabel.setFont(Font.font("Arial", FontWeight.BOLD, 18));
        titleLabel.setTextFill(Color.web("#2c3e50"));

        // Back to Dashboard button
        Button backButton = new Button("← Back to Dashboard");
        backButton.setStyle("-fx-background-color: #95a5a6; " +
                           "-fx-text-fill: white; " +
                           "-fx-background-radius: 5; " +
                           "-fx-font-weight: bold; " +
                           "-fx-padding: 8 15;");
        backButton.setMaxWidth(Double.MAX_VALUE);
        backButton.setOnAction(e -> handleBackToDashboard());

        // Group filter label
        Label filterLabel = new Label("Filter by Group:");
        filterLabel.setFont(Font.font("Arial", FontWeight.BOLD, 12));
        filterLabel.setTextFill(Color.web("#34495e"));

        // Group filter ListView
        groupFilterListView = new ListView<>();
        groupFilterListView.setPrefHeight(100);
        groupFilterListView.setStyle("-fx-background-color: #ecf0f1; " +
                                    "-fx-background-radius: 5;");
        groupFilterListView.getSelectionModel().selectedItemProperty().addListener(
            (observable, oldValue, newValue) -> handleGroupFilterSelection(newValue)
        );

        // "All Groups" option
        groupFilterListView.getItems().add("All Groups");

        // Expense ListView
        expenseListView = new ListView<>();
        expenseListView.setPrefHeight(350);
        expenseListView.setStyle("-fx-background-color: #ecf0f1; " +
                                "-fx-background-radius: 5;");
        expenseListView.getSelectionModel().selectedItemProperty().addListener(
            (observable, oldValue, newValue) -> handleExpenseSelection(newValue)
        );

        // Add Expense button
        Button addExpenseButton = new Button("Add New Expense");
        addExpenseButton.setStyle("-fx-background-color: #27ae60; " +
                                "-fx-text-fill: white; " +
                                "-fx-background-radius: 5; " +
                                "-fx-font-weight: bold; " +
                                "-fx-padding: 10 20;");
        addExpenseButton.setMaxWidth(Double.MAX_VALUE);
        addExpenseButton.setOnAction(e -> handleAddExpense());

        // Refresh button
        Button refreshButton = new Button("Refresh");
        refreshButton.setStyle("-fx-background-color: #3498db; " +
                             "-fx-text-fill: white; " +
                             "-fx-background-radius: 5; " +
                             "-fx-font-weight: bold; " +
                             "-fx-padding: 10 20;");
        refreshButton.setMaxWidth(Double.MAX_VALUE);
        refreshButton.setOnAction(e -> refreshExpenseList());

        // Add elements to panel
        panel.getChildren().addAll(titleLabel, backButton, filterLabel, groupFilterListView, 
                                  expenseListView, addExpenseButton, refreshButton);

        return panel;
    }

    /**
     * Creates the right panel containing selected expense details and actions.
     *
     * @return VBox with expense details and action buttons
     */
    private VBox createRightPanel() {
        VBox panel = new VBox(15);
        panel.setPadding(new Insets(20));
        panel.setStyle("-fx-background-color: white;");
        panel.setAlignment(Pos.TOP_CENTER);

        // Selected expense label
        selectedExpenseLabel = new Label("Select an expense to view details");
        selectedExpenseLabel.setFont(Font.font("Arial", FontWeight.BOLD, 20));
        selectedExpenseLabel.setTextFill(Color.web("#2c3e50"));
        selectedExpenseLabel.setWrapText(true);

        // Expense details label
        expenseDetailsLabel = new Label("");
        expenseDetailsLabel.setFont(Font.font("Arial", 14));
        expenseDetailsLabel.setTextFill(Color.web("#34495e"));
        expenseDetailsLabel.setWrapText(true);
        expenseDetailsLabel.setVisible(false);

        // Action buttons container
        HBox buttonBox = new HBox(10);
        buttonBox.setAlignment(Pos.CENTER);
        buttonBox.setVisible(false);

        // Delete Expense button
        Button deleteExpenseButton = new Button("Delete Expense");
        deleteExpenseButton.setStyle("-fx-background-color: #e74c3c; " +
                                    "-fx-text-fill: white; " +
                                    "-fx-background-radius: 5; " +
                                    "-fx-font-weight: bold; " +
                                    "-fx-padding: 10 15;");
        deleteExpenseButton.setOnAction(e -> handleDeleteExpense());

        buttonBox.getChildren().add(deleteExpenseButton);

        // Error label
        errorLabel = new Label("");
        errorLabel.setTextFill(Color.RED);
        errorLabel.setFont(Font.font("Arial", 11));
        errorLabel.setWrapText(true);

        // Add elements to panel
        panel.getChildren().addAll(selectedExpenseLabel, expenseDetailsLabel, buttonBox, errorLabel);

        return panel;
    }

    /**
     * Loads the current user's groups from the database.
     * Populates the group filter ListView.
     */
    private void loadUserGroups() {
        try {
            userGroups = groupDAO.getGroupsByUser(currentUser.getId());

            // Add group names to filter list
            for (Group group : userGroups) {
                groupFilterListView.getItems().add(group.getName());
            }

            // Select "All Groups" by default
            groupFilterListView.getSelectionModel().select(0);

        } catch (Exception e) {
            errorLabel.setText("Error loading groups: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Refreshes the expense ListView with the current user's expenses.
     * Filters by selected group if a group filter is active.
     */
    private void refreshExpenseList() {
        try {
            // Clear current list
            expenseListView.getItems().clear();

            List<Expense> expenses;

            // Filter by selected group or show all
            if (selectedGroup != null) {
                expenses = expenseDAO.getExpensesByGroup(selectedGroup.getId());
            } else {
                // Show expenses from all user's groups
                expenses = getAllUserExpenses();
            }

            // Add expense summaries to ListView
            for (Expense expense : expenses) {
                String summary = String.format("%s - $%.2f (%s)", 
                    expense.getTitle(), 
                    expense.getAmount(),
                    expense.getCategory());
                expenseListView.getItems().add(summary);
            }

        } catch (Exception e) {
            errorLabel.setText("Error loading expenses: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Gets all expenses for the current user across all their groups.
     *
     * @return List of all user's expenses
     */
    private List<Expense> getAllUserExpenses() {
        List<Expense> allExpenses = new java.util.ArrayList<>();

        try {
            for (Group group : userGroups) {
                List<Expense> groupExpenses = expenseDAO.getExpensesByGroup(group.getId());
                allExpenses.addAll(groupExpenses);
            }
        } catch (Exception e) {
            errorLabel.setText("Error loading expenses: " + e.getMessage());
        }

        return allExpenses;
    }

    /**
     * Handles group filter selection from the ListView.
     * Updates the expense list to show only expenses from the selected group.
     *
     * @param selectedGroupName the name of the selected group (or "All Groups")
     */
    private void handleGroupFilterSelection(String selectedGroupName) {
        if (selectedGroupName == null) {
            return;
        }

        // Clear previous error
        errorLabel.setText("");

        if (selectedGroupName.equals("All Groups")) {
            selectedGroup = null;
        } else {
            // Find the selected group
            for (Group group : userGroups) {
                if (group.getName().equals(selectedGroupName)) {
                    selectedGroup = group;
                    break;
                }
            }
        }

        // Refresh expense list with new filter
        refreshExpenseList();
    }

    /**
     * Handles expense selection from the ListView.
     * Loads expense details and populates the right panel.
     *
     * @param selectedExpenseSummary the summary string of the selected expense
     */
    private void handleExpenseSelection(String selectedExpenseSummary) {
        if (selectedExpenseSummary == null) {
            return;
        }

        // Clear previous error
        errorLabel.setText("");

        try {
            // Extract expense title from summary (before " - $")
            String expenseTitle = selectedExpenseSummary.substring(0, selectedExpenseSummary.indexOf(" - $"));

            // Find the expense from the list
            List<Expense> expenses;
            if (selectedGroup != null) {
                expenses = expenseDAO.getExpensesByGroup(selectedGroup.getId());
            } else {
                expenses = getAllUserExpenses();
            }

            for (Expense expense : expenses) {
                if (expense.getTitle().equals(expenseTitle)) {
                    selectedExpense = expense;
                    break;
                }
            }

            if (selectedExpense != null) {
                // Update UI with selected expense details
                selectedExpenseLabel.setText(selectedExpense.getTitle());

                String details = String.format(
                    "Amount: $%.2f\n" +
                    "Category: %s\n" +
                    "Split Type: %s\n" +
                    "Date: %s\n" +
                    "Group ID: %d\n" +
                    "Paid By: User ID %d",
                    selectedExpense.getAmount(),
                    selectedExpense.getCategory(),
                    selectedExpense.getSplitType(),
                    selectedExpense.getDate(),
                    selectedExpense.getGroupId(),
                    selectedExpense.getPaidBy()
                );

                expenseDetailsLabel.setText(details);
                expenseDetailsLabel.setVisible(true);

                // Show delete button
                HBox buttonBox = (HBox) ((VBox) this.getRight()).getChildren().get(2);
                buttonBox.setVisible(true);
                buttonBox.setManaged(true);
            }

        } catch (Exception e) {
            errorLabel.setText("Error loading expense details: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Handles the Add Expense button click event.
     * Shows a dialog to select a group, then navigates to AddExpenseScreen.
     */
    private void handleAddExpense() {
        if (userGroups == null || userGroups.isEmpty()) {
            Alert alert = new Alert(Alert.AlertType.WARNING);
            alert.setTitle("No Groups");
            alert.setHeaderText("No Groups Available");
            alert.setContentText("You need to create or join a group before adding expenses.");
            alert.showAndWait();
            return;
        }

        // If only one group, use it directly
        if (userGroups.size() == 1) {
            navigateToAddExpense(userGroups.get(0));
            return;
        }

        // If multiple groups, show selection dialog
        ChoiceDialog<Group> dialog = new ChoiceDialog<>(userGroups.get(0), userGroups);
        dialog.setTitle("Select Group");
        dialog.setHeaderText("Select a group for this expense");
        dialog.setContentText("Choose a group:");

        dialog.showAndWait().ifPresent(group -> {
            navigateToAddExpense(group);
        });
    }

    /**
     * Navigates to the AddExpenseScreen for the specified group.
     *
     * @param group the Group object for which to add an expense
     */
    private void navigateToAddExpense(Group group) {
        AddExpenseScreen addExpenseScreen = new AddExpenseScreen();
        navigateTo(addExpenseScreen, "Add Expense - AI Expense Splitter");
    }

    /**
     * Handles the Delete Expense button click event.
     * Shows a confirmation dialog and deletes the expense if confirmed.
     */
    private void handleDeleteExpense() {
        if (selectedExpense == null) {
            errorLabel.setText("Please select an expense to delete.");
            return;
        }

        // Clear previous error
        errorLabel.setText("");

        // Show confirmation dialog
        Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
        alert.setTitle("Delete Expense");
        alert.setHeaderText("Delete Expense: " + selectedExpense.getTitle());
        alert.setContentText("Are you sure you want to delete this expense? This action cannot be undone.");

        alert.showAndWait().ifPresent(response -> {
            if (response == ButtonType.OK) {
                try {
                    // Delete expense from database
                    boolean success = expenseDAO.deleteExpense(selectedExpense.getId());

                    if (success) {
                        // Clear selection
                        selectedExpense = null;
                        selectedExpenseLabel.setText("Select an expense to view details");
                        expenseDetailsLabel.setText("");
                        expenseDetailsLabel.setVisible(false);

                        // Hide delete button
                        HBox buttonBox = (HBox) ((VBox) this.getRight()).getChildren().get(2);
                        buttonBox.setVisible(false);
                        buttonBox.setManaged(false);

                        // Refresh expense list
                        refreshExpenseList();
                        errorLabel.setText(""); // Clear error
                    } else {
                        errorLabel.setText("Failed to delete expense. Please try again.");
                    }

                } catch (Exception e) {
                    errorLabel.setText("Error deleting expense: " + e.getMessage());
                    e.printStackTrace();
                }
            }
        });
    }

    /**
     * Handles navigation back to the Dashboard screen.
     */
    private void handleBackToDashboard() {
        navigateTo(new DashboardView(), "Dashboard - AI Expense Splitter");
    }

    /**
     * Helper method to switch root layout on the current Scene.
     *
     * @param newRoot The Parent layout of the view to display.
     * @param title   The title of the window stage.
     */
    private void navigateTo(javafx.scene.Parent newRoot, String title) {
        javafx.scene.Scene scene = getScene();
        if (scene != null) {
            scene.setRoot(newRoot);
            javafx.stage.Stage stage = (javafx.stage.Stage) scene.getWindow();
            if (stage != null) {
                stage.setTitle(title);
            }
        }
    }
}
