package com.expensesplitter.dao;

import com.expensesplitter.models.Expense;
import com.expensesplitter.utils.DatabaseConnection;
import com.expensesplitter.utils.SessionManager;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Data Access Object for Expenses table.
 * Handles all expense CRUD and search operations.
 *
 * Methods:
 *   addExpense()         — INSERT new expense
 *   getExpenseById()     — SELECT by ID
 *   getExpensesByGroup() — SELECT all for a group
 *   searchExpenses()     — Overloaded: by keyword / date range / both (METHOD OVERLOADING)
 *   updateExpense()      — UPDATE expense record
 *   deleteExpense()      — DELETE expense
 *   getMonthlyTotal()    — SELECT SUM for forecasting
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.dao
 */
public class ExpenseDAO {

    /**
     * Saves a new expense to the database using PreparedStatement.
     * Demonstrates ENCAPSULATION — hides SQL details from calling code.
     *
     * @param expense the Expense object to insert
     * @return true if insertion successful, false otherwise
     * @throws SQLException if database error occurs
     */
    public boolean addExpense(Expense expense) throws SQLException {
        String sql = "INSERT INTO Expenses (title, amount, group_id, paid_by, category, split_type, date) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            pstmt.setString(1, expense.getTitle());
            pstmt.setDouble(2, expense.getAmount());
            pstmt.setInt(3, expense.getGroupId());
            pstmt.setInt(4, expense.getPaidBy());
            pstmt.setString(5, expense.getCategory());
            pstmt.setString(6, expense.getSplitType());
            pstmt.setDate(7, new java.sql.Date(expense.getDate().getTime()));

            int rowsAffected = pstmt.executeUpdate();

            if (rowsAffected > 0) {
                // Retrieve auto-generated ID and set it in the expense object
                try (ResultSet rs = pstmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        expense.setId(rs.getInt(1));
                    }
                }
                return true;
            }
            return false;
        }
    }

    /**
     * Retrieves an expense by its unique ID using PreparedStatement.
     * Demonstrates ENCAPSULATION — hides SQL query complexity.
     *
     * @param id the expense ID to search for
     * @return Expense object if found, null otherwise
     * @throws SQLException if database error occurs
     */
    public Expense getExpenseById(int id) throws SQLException {
        String sql = "SELECT * FROM Expenses WHERE id = ?";

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToExpense(rs);
                }
            }
        }
        return null;
    }

    /**
     * Returns all expenses belonging to a specific group using PreparedStatement.
     * Demonstrates ENCAPSULATION — hides SQL query complexity.
     *
     * @param groupId the group ID to filter expenses by
     * @return List of Expense objects belonging to the group
     * @throws SQLException if database error occurs
     */
    public List<Expense> getExpensesByGroup(int groupId) throws SQLException {
        String sql = "SELECT * FROM Expenses WHERE group_id = ? ORDER BY date DESC";
        List<Expense> expenses = new ArrayList<>();

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, groupId);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    expenses.add(mapResultSetToExpense(rs));
                }
            }
        }
        return expenses;
    }

    /**
     * Primary search method — returns expenses from all groups the user belongs to.
     * Uses a dynamic WHERE clause so keyword, date range, and category filters
     * can be combined in a single query.
     *
     * Fix: JOIN GroupMembers so expenses paid by other members are included,
     * not only expenses where paid_by = current user.
     *
     * @param userId   current logged-in user ID (group membership filter)
     * @param keyword  optional title search (partial match, case-insensitive); null = no filter
     * @param from     optional start date (inclusive); null = no lower bound
     * @param to       optional end date (inclusive); null = no upper bound
     * @param category optional category filter; null = all categories
     * @return list of matching Expense objects ordered by date descending
     * @throws SQLException if database error occurs
     */
    public List<Expense> searchExpenses(int userId, String keyword,
                                        LocalDate from, LocalDate to,
                                        String category) throws SQLException {
        // Base query: all expenses in groups the user belongs to
        StringBuilder sql = new StringBuilder(
                "SELECT DISTINCT e.id, e.title, e.amount, e.group_id, e.paid_by, " +
                "e.category, e.split_type, e.date, u.name AS payer_name " +
                "FROM Expenses e " +
                "JOIN GroupMembers gm ON e.group_id = gm.group_id " +
                "JOIN Users u ON e.paid_by = u.id " +
                "WHERE gm.user_id = ?");

        List<Object> params = new ArrayList<>();
        params.add(userId);

        // Optional keyword filter — case-insensitive partial match on title
        if (keyword != null && !keyword.isEmpty()) {
            sql.append(" AND LOWER(e.title) LIKE LOWER(?)");
            params.add("%" + keyword + "%");
        }

        // Optional date range filters (each bound is independent)
        if (from != null) {
            sql.append(" AND e.date >= ?");
            params.add(java.sql.Date.valueOf(from));
        }
        if (to != null) {
            sql.append(" AND e.date <= ?");
            params.add(java.sql.Date.valueOf(to));
        }

        // Optional category filter — case-insensitive exact match
        if (category != null && !category.isEmpty()) {
            sql.append(" AND LOWER(e.category) = LOWER(?)");
            params.add(category);
        }

        sql.append(" ORDER BY e.date DESC");

        // Debug output for troubleshooting search issues
        System.out.println("Search SQL: " + sql);
        System.out.println("Params: " + params);

        List<Expense> list = new ArrayList<>();

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {

            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToExpense(rs));
                }
            }
        }

        System.out.println("Search results: " + list.size());
        return list;
    }

    /**
     * METHOD OVERLOADING — search by keyword only for the logged-in user.
     * Delegates to the primary searchExpenses(userId, ...) method.
     *
     * @param keyword the title search term (partial match)
     * @return List of Expense objects matching the keyword
     * @throws SQLException if database error occurs or no user is logged in
     */
    public List<Expense> searchExpenses(String keyword) throws SQLException {
        int userId = requireCurrentUserId();
        return searchExpenses(userId, keyword, null, null, null);
    }

    /**
     * METHOD OVERLOADING — search by date range only for the logged-in user.
     * Delegates to the primary searchExpenses(userId, ...) method.
     *
     * @param from the start date (inclusive)
     * @param to   the end date (inclusive)
     * @return List of Expense objects within the date range
     * @throws SQLException if database error occurs or no user is logged in
     */
    public List<Expense> searchExpenses(Date from, Date to) throws SQLException {
        int userId = requireCurrentUserId();
        LocalDate fromLocal = from != null
                ? new java.sql.Date(from.getTime()).toLocalDate() : null;
        LocalDate toLocal = to != null
                ? new java.sql.Date(to.getTime()).toLocalDate() : null;
        return searchExpenses(userId, null, fromLocal, toLocal, null);
    }

    /**
     * METHOD OVERLOADING — search by keyword AND date range for the logged-in user.
     * Delegates to the primary searchExpenses(userId, ...) method.
     *
     * @param keyword the title search term (partial match)
     * @param from    the start date (inclusive)
     * @param to      the end date (inclusive)
     * @return List of Expense objects matching both criteria
     * @throws SQLException if database error occurs or no user is logged in
     */
    public List<Expense> searchExpenses(String keyword, Date from, Date to) throws SQLException {
        int userId = requireCurrentUserId();
        LocalDate fromLocal = from != null
                ? new java.sql.Date(from.getTime()).toLocalDate() : null;
        LocalDate toLocal = to != null
                ? new java.sql.Date(to.getTime()).toLocalDate() : null;
        return searchExpenses(userId, keyword, fromLocal, toLocal, null);
    }

    /**
     * Resolves the logged-in user ID for overloaded search methods.
     *
     * @return current user ID from SessionManager
     * @throws SQLException if no user is logged in
     */
    private int requireCurrentUserId() throws SQLException {
        if (SessionManager.getCurrentUser() == null) {
            throw new SQLException("No logged-in user for expense search");
        }
        return SessionManager.getCurrentUser().getId();
    }

    /**
     * Updates an existing expense record using PreparedStatement.
     * Demonstrates ENCAPSULATION — hides SQL update complexity.
     *
     * @param expense the Expense object with updated values
     * @return true if update successful, false otherwise
     * @throws SQLException if database error occurs
     */
    public boolean updateExpense(Expense expense) throws SQLException {
        String sql = "UPDATE Expenses SET title = ?, amount = ?, group_id = ?, " +
                     "paid_by = ?, category = ?, split_type = ?, date = ? WHERE id = ?";

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, expense.getTitle());
            pstmt.setDouble(2, expense.getAmount());
            pstmt.setInt(3, expense.getGroupId());
            pstmt.setInt(4, expense.getPaidBy());
            pstmt.setString(5, expense.getCategory());
            pstmt.setString(6, expense.getSplitType());
            pstmt.setDate(7, new java.sql.Date(expense.getDate().getTime()));
            pstmt.setInt(8, expense.getId());

            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        }
    }

    /**
     * Deletes an expense by ID using PreparedStatement.
     * Demonstrates ENCAPSULATION — hides SQL delete complexity.
     *
     * @param id the expense ID to delete
     * @return true if deletion successful, false otherwise
     * @throws SQLException if database error occurs
     */
    public boolean deleteExpense(int id) throws SQLException {
        String sql = "DELETE FROM Expenses WHERE id = ?";

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);

            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        }
    }

    /**
     * Returns total spending for a user in a given month.
     * Used by SpendingForecaster for Linear Regression training.
     * Demonstrates ENCAPSULATION — hides SQL aggregation complexity.
     *
     * @param userId  the user's ID
     * @param month   month number (1-12)
     * @param year    the year
     * @return total amount spent by the user in the specified month/year
     * @throws SQLException if database error occurs
     */
    public double getMonthlyTotal(int userId, int month, int year) throws SQLException {
        String sql = "SELECT COALESCE(SUM(e.amount), 0) FROM Expenses e " +
                     "JOIN GroupMembers gm ON e.group_id = gm.group_id " +
                     "WHERE gm.user_id = ? AND MONTH(e.date) = ? AND YEAR(e.date) = ?";

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, userId);
            pstmt.setInt(2, month);
            pstmt.setInt(3, year);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getDouble(1);
                }
            }
        }
        return 0.0;
    }

    /**
     * Returns total spending for a specific group in a given month/year.
     *
     * @param groupId group ID
     * @param month   month number (1-12)
     * @param year    year
     * @return total amount for the group in that month
     * @throws SQLException if database error occurs
     */
    public double getMonthlyTotalByGroup(int groupId, int month, int year) throws SQLException {
        String sql = "SELECT COALESCE(SUM(amount), 0) FROM Expenses " +
                     "WHERE group_id = ? AND MONTH(date) = ? AND YEAR(date) = ?";

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, groupId);
            pstmt.setInt(2, month);
            pstmt.setInt(3, year);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getDouble(1);
                }
            }
        }
        return 0.0;
    }

    /**
     * Returns total spending per category for a user's groups in a given month/year.
     *
     * @param userId user whose group expenses to aggregate
     * @param month  month number (1-12)
     * @param year   year (e.g. 2026)
     * @return map of category name → total amount
     * @throws SQLException if database error occurs
     */
    public Map<String, Double> getCategoryTotalsForUser(int userId, int month, int year) throws SQLException {
        String sql = "SELECT e.category, COALESCE(SUM(e.amount), 0) AS total " +
                     "FROM Expenses e " +
                     "JOIN GroupMembers gm ON e.group_id = gm.group_id " +
                     "WHERE gm.user_id = ? AND MONTH(e.date) = ? AND YEAR(e.date) = ? " +
                     "GROUP BY e.category " +
                     "ORDER BY total DESC";

        Map<String, Double> totals = new LinkedHashMap<>();

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, userId);
            pstmt.setInt(2, month);
            pstmt.setInt(3, year);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    String category = rs.getString("category");
                    if (category == null || category.isBlank()) {
                        category = "Other";
                    }
                    totals.put(category, rs.getDouble("total"));
                }
            }
        }
        return totals;
    }

    /**
     * Returns total spending per category for a user's groups (all time, no month filter).
     *
     * @param userId user whose group expenses to aggregate
     * @return map of category name → total amount
     * @throws SQLException if database error occurs
     */
    public Map<String, Double> getCategoryTotalsForUserAllTime(int userId) throws SQLException {
        String sql = "SELECT e.category, COALESCE(SUM(e.amount), 0) AS total " +
                     "FROM Expenses e " +
                     "JOIN GroupMembers gm ON e.group_id = gm.group_id " +
                     "WHERE gm.user_id = ? " +
                     "GROUP BY e.category " +
                     "ORDER BY total DESC";

        Map<String, Double> totals = new LinkedHashMap<>();

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, userId);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    String category = rs.getString("category");
                    if (category == null || category.isBlank()) {
                        category = "Other";
                    }
                    totals.put(category, rs.getDouble("total"));
                }
            }
        }
        return totals;
    }

    /**
     * Returns total spending per category for a specific group in a given month/year.
     *
     * @param groupId group ID (-1 ignored — use user methods instead)
     * @param month   month number (1-12)
     * @param year    year
     * @return map of category name → total amount
     * @throws SQLException if database error occurs
     */
    public Map<String, Double> getCategoryTotalsByGroup(int groupId, int month, int year) throws SQLException {
        String sql = "SELECT category, COALESCE(SUM(amount), 0) AS total " +
                     "FROM Expenses " +
                     "WHERE group_id = ? AND MONTH(date) = ? AND YEAR(date) = ? " +
                     "GROUP BY category " +
                     "ORDER BY total DESC";

        Map<String, Double> totals = new LinkedHashMap<>();

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, groupId);
            pstmt.setInt(2, month);
            pstmt.setInt(3, year);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    String category = rs.getString("category");
                    if (category == null || category.isBlank()) {
                        category = "Other";
                    }
                    totals.put(category, rs.getDouble("total"));
                }
            }
        }
        return totals;
    }

    /**
     * Returns total spending per category for a specific group (all time).
     *
     * @param groupId group ID
     * @return map of category name → total amount
     * @throws SQLException if database error occurs
     */
    /**
     * Counts expenses for a user across all their groups in a given month/year.
     *
     * @param userId user ID
     * @param month  month (1-12)
     * @param year   year
     * @return number of expense records
     * @throws SQLException if database error occurs
     */
    public int getExpenseCountForUser(int userId, int month, int year) throws SQLException {
        String sql = "SELECT COUNT(*) FROM Expenses e " +
                     "JOIN GroupMembers gm ON e.group_id = gm.group_id " +
                     "WHERE gm.user_id = ? AND MONTH(e.date) = ? AND YEAR(e.date) = ?";

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, userId);
            pstmt.setInt(2, month);
            pstmt.setInt(3, year);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        }
        return 0;
    }

    public Map<String, Double> getCategoryTotalsByGroupAllTime(int groupId) throws SQLException {
        String sql = "SELECT category, COALESCE(SUM(amount), 0) AS total " +
                     "FROM Expenses " +
                     "WHERE group_id = ? " +
                     "GROUP BY category " +
                     "ORDER BY total DESC";

        Map<String, Double> totals = new LinkedHashMap<>();

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, groupId);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    String category = rs.getString("category");
                    if (category == null || category.isBlank()) {
                        category = "Other";
                    }
                    totals.put(category, rs.getDouble("total"));
                }
            }
        }
        return totals;
    }

    /**
     * Helper method to map a ResultSet row to an Expense object.
     * Demonstrates CODE REUSE — avoids duplication in getter methods.
     *
     * @param rs the ResultSet positioned at a valid row
     * @return Expense object populated with data from ResultSet
     * @throws SQLException if database error occurs during mapping
     */
    private Expense mapResultSetToExpense(ResultSet rs) throws SQLException {
        Expense expense = new Expense();
        expense.setId(rs.getInt("id"));
        expense.setTitle(rs.getString("title"));
        expense.setAmount(rs.getDouble("amount"));
        expense.setGroupId(rs.getInt("group_id"));
        expense.setPaidBy(rs.getInt("paid_by"));
        expense.setCategory(rs.getString("category"));
        expense.setSplitType(rs.getString("split_type"));
        expense.setDate(rs.getDate("date"));
        return expense;
    }
}
