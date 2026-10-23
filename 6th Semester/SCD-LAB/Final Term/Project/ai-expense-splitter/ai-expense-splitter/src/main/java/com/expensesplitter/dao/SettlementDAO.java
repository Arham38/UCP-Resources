package com.expensesplitter.dao;

import com.expensesplitter.models.Settlement;
import com.expensesplitter.utils.DatabaseConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for Settlements table.
 * Handles saving and retrieving settlement records.
 *
 * Methods:
 *   saveSettlement()        — INSERT settlement record
 *   getSettlementsByGroup() — SELECT all settlements for a group
 *   markAsSettled()         — UPDATE settled = true
 *   deleteSettlement()      — DELETE record
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.dao
 */
public class SettlementDAO {

    /**
     * Saves a new settlement record to the database using PreparedStatement.
     * Demonstrates ENCAPSULATION — hides SQL details from calling code.
     *
     * @param settlement the Settlement object to insert
     * @return true if insertion successful, false otherwise
     * @throws SQLException if database error occurs
     */
    public boolean saveSettlement(Settlement settlement) throws SQLException {
        String sql = "INSERT INTO Settlements (group_id, from_user, to_user, amount, settled) " +
                     "VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            pstmt.setInt(1, settlement.getGroupId());
            pstmt.setInt(2, settlement.getFromUserId());
            pstmt.setInt(3, settlement.getToUserId());
            pstmt.setDouble(4, settlement.getAmount());
            pstmt.setBoolean(5, settlement.isSettled());

            int rowsAffected = pstmt.executeUpdate();

            if (rowsAffected > 0) {
                // Retrieve auto-generated ID and set it in the settlement object
                try (ResultSet rs = pstmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        settlement.setId(rs.getInt(1));
                    }
                }
                return true;
            }
            return false;
        }
    }

    /**
     * Retrieves all settlement records for a specific group using PreparedStatement.
     * Demonstrates ENCAPSULATION — hides SQL query complexity.
     *
     * @param groupId the group ID to filter settlements by
     * @return List of Settlement objects belonging to the group
     * @throws SQLException if database error occurs
     */
    public List<Settlement> getSettlementsByGroup(int groupId) throws SQLException {
        String sql = "SELECT * FROM Settlements WHERE group_id = ? ORDER BY settled ASC, amount DESC";
        List<Settlement> settlements = new ArrayList<>();

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, groupId);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    settlements.add(mapResultSetToSettlement(rs));
                }
            }
        }
        return settlements;
    }

    /**
     * Marks a settlement as paid/cleared using PreparedStatement.
     * Demonstrates ENCAPSULATION — hides SQL update complexity.
     *
     * @param settlementId the ID of the settlement to mark as settled
     * @return true if update successful, false otherwise
     * @throws SQLException if database error occurs
     */
    public boolean markAsSettled(int settlementId) throws SQLException {
        String sql = "UPDATE Settlements SET settled = true WHERE id = ?";

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, settlementId);

            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        }
    }

    /**
     * Deletes a settlement by ID using PreparedStatement.
     * Demonstrates ENCAPSULATION — hides SQL delete complexity.
     *
     * @param id the settlement ID to delete
     * @return true if deletion successful, false otherwise
     * @throws SQLException if database error occurs
     */
    public boolean deleteSettlement(int id) throws SQLException {
        String sql = "DELETE FROM Settlements WHERE id = ?";

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);

            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        }
    }

    /**
     * Helper method to map a ResultSet row to a Settlement object.
     * Demonstrates CODE REUSE — avoids duplication in getter methods.
     *
     * @param rs the ResultSet positioned at a valid row
     * @return Settlement object populated with data from ResultSet
     * @throws SQLException if database error occurs during mapping
     */
    private Settlement mapResultSetToSettlement(ResultSet rs) throws SQLException {
        Settlement settlement = new Settlement();
        settlement.setId(rs.getInt("id"));
        settlement.setGroupId(rs.getInt("group_id"));
        settlement.setFromUserId(rs.getInt("from_user"));
        settlement.setToUserId(rs.getInt("to_user"));
        settlement.setAmount(rs.getDouble("amount"));
        settlement.setSettled(rs.getBoolean("settled"));
        return settlement;
    }
}
