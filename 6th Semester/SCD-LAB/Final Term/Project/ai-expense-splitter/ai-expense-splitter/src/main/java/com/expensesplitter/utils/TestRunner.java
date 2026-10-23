package com.expensesplitter.utils;

import com.expensesplitter.ai.MLCategoryPredictor;
import com.expensesplitter.ai.SettlementEngine;
import com.expensesplitter.dao.ExpenseDAO;
import com.expensesplitter.dao.GroupDAO;
import com.expensesplitter.dao.SettlementDAO;
import com.expensesplitter.dao.UserDAO;
import com.expensesplitter.models.*;

import java.sql.Date;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * TestRunner - Comprehensive integration test suite for AI-Powered Expense Splitter.
 * Tests all critical integrations without requiring the JavaFX UI.
 * 
 * Tests:
 *   1. Database Connection
 *   2. User Creation + Login
 *   3. Expense Add + Retrieve
 *   4. Settlement Calculation
 *   5. ML Category Prediction
 *
 * Usage: Run main() method to execute all tests.
 * Output: Each test prints PASS or FAIL with reason.
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.utils
 */
public class TestRunner {

    private static int testsPassed = 0;
    private static int testsFailed = 0;

    /**
     * Main entry point - runs all integration tests.
     *
     * @param args command-line arguments (not used)
     */
    public static void main(String[] args) {
        System.out.println("========================================");
        System.out.println("AI-Powered Expense Splitter - Integration Tests");
        System.out.println("========================================\n");

        // Test 1: Database Connection
        testDatabaseConnection();

        // Test 2: User Creation + Login
        testUserCreationAndLogin();

        // Test 3: Expense Add + Retrieve
        testExpenseAddAndRetrieve();

        // Test 4: Settlement Calculation
        testSettlementCalculation();

        // Test 5: ML Category Prediction
        testMLCategoryPrediction();

        // Print Summary
        System.out.println("\n========================================");
        System.out.println("TEST SUMMARY");
        System.out.println("========================================");
        System.out.println("Tests Passed: " + testsPassed);
        System.out.println("Tests Failed: " + testsFailed);
        System.out.println("Total Tests:  " + (testsPassed + testsFailed));
        System.out.println("========================================");

        System.exit(testsFailed > 0 ? 1 : 0);
    }

    /**
     * Test 1: Database Connection
     * Verifies that DatabaseConnection singleton works correctly.
     */
    private static void testDatabaseConnection() {
        System.out.println("TEST 1: Database Connection");
        System.out.println("----------------------------------------");

        try {
            // Get connection instance
            java.sql.Connection conn = DatabaseConnection.getInstance();

            if (conn == null) {
                printFail("Connection is null");
                return;
            }

            if (conn.isClosed()) {
                printFail("Connection is closed");
                return;
            }

            // Test a simple query
            java.sql.Statement stmt = conn.createStatement();
            java.sql.ResultSet rs = stmt.executeQuery("SELECT 1");
            if (rs.next() && rs.getInt(1) == 1) {
                printPass("Database connection successful");
            } else {
                printFail("Test query failed");
            }
            rs.close();
            stmt.close();

        } catch (SQLException e) {
            printFail("SQLException: " + e.getMessage());
        }
    }

    /**
     * Test 2: User Creation + Login
     * Tests UserDAO.createUser() and getUserByEmail().
     */
    private static void testUserCreationAndLogin() {
        System.out.println("\nTEST 2: User Creation + Login");
        System.out.println("----------------------------------------");

        UserDAO userDAO = new UserDAO();
        String testEmail = "testuser_" + System.currentTimeMillis() + "@example.com";
        String testName = "Test User";
        String testPassword = "testpass123";

        try {
            // Step 1: Check if user already exists
            User existingUser = userDAO.getUserByEmail(testEmail);
            if (existingUser != null) {
                printSkip("Test user already exists, skipping creation test");
                return;
            }

            // Step 2: Create user
            String hashedPassword = PasswordHasher.hashPassword(testPassword);
            User newUser = new User(0, testName, testEmail, hashedPassword);
            
            boolean created = userDAO.createUser(newUser);
            if (!created) {
                printFail("Failed to create user");
                return;
            }

            // Step 3: Retrieve user
            User retrievedUser = userDAO.getUserByEmail(testEmail);
            if (retrievedUser == null) {
                printFail("Failed to retrieve user after creation");
                return;
            }

            // Step 4: Verify user details
            if (!retrievedUser.getName().equals(testName)) {
                printFail("User name mismatch");
                return;
            }

            if (!retrievedUser.getEmail().equals(testEmail)) {
                printFail("User email mismatch");
                return;
            }

            // Step 5: Verify password
            if (!PasswordHasher.verifyPassword(testPassword, retrievedUser.getPasswordHash())) {
                printFail("Password verification failed");
                return;
            }

            printPass("User creation and login successful");

            // Cleanup: Delete test user
            // Note: UserDAO doesn't have deleteUser method, so we skip cleanup

        } catch (SQLException e) {
            printFail("SQLException: " + e.getMessage());
        }
    }

    /**
     * Test 3: Expense Add + Retrieve
     * Tests ExpenseDAO.addExpense() and getExpensesByGroup().
     */
    private static void testExpenseAddAndRetrieve() {
        System.out.println("\nTEST 3: Expense Add + Retrieve");
        System.out.println("----------------------------------------");

        ExpenseDAO expenseDAO = new ExpenseDAO();
        GroupDAO groupDAO = new GroupDAO();
        UserDAO userDAO = new UserDAO();

        try {
            // Step 1: Get or create test user
            User testUser = userDAO.getUserByEmail("test@example.com");
            if (testUser == null) {
                printSkip("Test user not found, skipping expense test");
                return;
            }

            // Step 2: Get or create test group
            List<Group> groups = groupDAO.getGroupsByUser(testUser.getId());
            Group testGroup = null;
            if (groups.isEmpty()) {
                // Create test group
                testGroup = new Group(0, "Test Group", "Test Description", testUser.getId());
                boolean created = groupDAO.createGroup(testGroup);
                if (!created) {
                    printFail("Failed to create test group");
                    return;
                }
                // Refresh to get the group with ID
                groups = groupDAO.getGroupsByUser(testUser.getId());
                if (groups.isEmpty()) {
                    printFail("Failed to retrieve created group");
                    return;
                }
                testGroup = groups.get(0);
            } else {
                testGroup = groups.get(0);
            }

            // Step 3: Create test expense
            Expense testExpense = new Expense(
                0,
                "Test Expense",
                100.0,
                testGroup.getId(),
                testUser.getId(),
                "Food",
                "Equal",
                Date.valueOf(java.time.LocalDate.now())
            );

            boolean added = expenseDAO.addExpense(testExpense);
            if (!added) {
                printFail("Failed to add expense");
                return;
            }

            // Step 4: Retrieve expenses
            List<Expense> expenses = expenseDAO.getExpensesByGroup(testGroup.getId());
            if (expenses.isEmpty()) {
                printFail("No expenses retrieved from group");
                return;
            }

            // Step 5: Verify expense details
            boolean found = false;
            for (Expense exp : expenses) {
                if (exp.getTitle().equals("Test Expense")) {
                    found = true;
                    if (exp.getAmount() != 100.0) {
                        printFail("Expense amount mismatch");
                        return;
                    }
                    break;
                }
            }

            if (!found) {
                printFail("Test expense not found in retrieved list");
                return;
            }

            printPass("Expense add and retrieve successful");

        } catch (SQLException e) {
            printFail("SQLException: " + e.getMessage());
        }
    }

    /**
     * Test 4: Settlement Calculation
     * Tests SettlementEngine.calculateNetBalances() and calculateSettlements().
     */
    private static void testSettlementCalculation() {
        System.out.println("\nTEST 4: Settlement Calculation");
        System.out.println("----------------------------------------");

        SettlementEngine settlementEngine = new SettlementEngine();
        GroupDAO groupDAO = new GroupDAO();
        UserDAO userDAO = new UserDAO();

        try {
            // Step 1: Get test user
            User testUser = userDAO.getUserByEmail("test@example.com");
            if (testUser == null) {
                printSkip("Test user not found, skipping settlement test");
                return;
            }

            // Step 2: Get test group
            List<Group> groups = groupDAO.getGroupsByUser(testUser.getId());
            if (groups.isEmpty()) {
                printSkip("No test group found, skipping settlement test");
                return;
            }
            Group testGroup = groups.get(0);

            // Step 3: Calculate net balances
            Map<Integer, Double> netBalances = settlementEngine.calculateNetBalances(testGroup.getId());
            if (netBalances == null) {
                printFail("Net balances calculation returned null");
                return;
            }

            // Step 4: Calculate settlements
            List<Settlement> settlements = settlementEngine.calculateSettlements(testGroup, netBalances);
            if (settlements == null) {
                printFail("Settlements calculation returned null");
                return;
            }

            printPass("Settlement calculation successful (found " + settlements.size() + " settlements)");

        } catch (Exception e) {
            printFail("Exception: " + e.getMessage());
        }
    }

    /**
     * Test 5: ML Category Prediction
     * Tests MLCategoryPredictor.loadModel() and predictCategory().
     */
    private static void testMLCategoryPrediction() {
        System.out.println("\nTEST 5: ML Category Prediction");
        System.out.println("----------------------------------------");

        MLCategoryPredictor predictor = MLCategoryPredictor.getInstance();

        try {
            // Step 1: Load model
            predictor.loadModel();

            // Step 2: Test predictions
            String[] testTitles = {
                "pizza",
                "uber ride",
                "electricity bill",
                "netflix subscription",
                "groceries"
            };

            int successfulPredictions = 0;
            for (String title : testTitles) {
                String category = predictor.predictCategory(title);
                if (category != null && !category.isEmpty()) {
                    successfulPredictions++;
                    System.out.println("  '" + title + "' -> " + category);
                }
            }

            if (successfulPredictions == testTitles.length) {
                printPass("ML category prediction successful (" + successfulPredictions + "/" + testTitles.length + ")");
            } else {
                printFail("ML category prediction partial success (" + successfulPredictions + "/" + testTitles.length + ")");
            }

        } catch (Exception e) {
            printFail("Exception: " + e.getMessage());
        }
    }

    /**
     * Prints a PASS message and increments the pass counter.
     *
     * @param message the success message
     */
    private static void printPass(String message) {
        System.out.println("✓ PASS: " + message);
        testsPassed++;
    }

    /**
     * Prints a FAIL message and increments the fail counter.
     *
     * @param message the failure reason
     */
    private static void printFail(String message) {
        System.out.println("✗ FAIL: " + message);
        testsFailed++;
    }

    /**
     * Prints a SKIP message.
     *
     * @param message the skip reason
     */
    private static void printSkip(String message) {
        System.out.println("○ SKIP: " + message);
    }
}
