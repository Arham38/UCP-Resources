// FIXED: Updated table/column names to groups_table; renamed addMember per spec
package com.expensesplitter.dao;

import com.expensesplitter.models.Group;
import com.expensesplitter.models.User;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class GroupDAO {

    public boolean createGroup(Group group) {
        String sql = "INSERT INTO groups_table (name, created_by) VALUES (?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, group.getName());
            ps.setInt(2, group.getCreatedBy());

            if (ps.executeUpdate() > 0) {
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) {
                        return addMember(keys.getInt(1), group.getCreatedBy());
                    }
                }
            }
            return false;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean addMember(int groupId, int userId) {
        String sql = "INSERT IGNORE INTO group_members (group_id, user_id) VALUES (?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, groupId);
            ps.setInt(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Group> getGroupsByUser(int userId) {
        List<Group> groups = new ArrayList<>();
        String sql = "SELECT g.id, g.name, g.created_by FROM groups_table g " +
                "INNER JOIN group_members gm ON g.id = gm.group_id " +
                "WHERE gm.user_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    groups.add(new Group(
                            rs.getInt("id"),
                            rs.getString("name"),
                            rs.getInt("created_by")
                    ));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return groups;
    }

    public List<Integer> getMemberIds(int groupId) {
        List<Integer> ids = new ArrayList<>();
        String sql = "SELECT user_id FROM group_members WHERE group_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, groupId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    ids.add(rs.getInt("user_id"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ids;
    }

    public int getMemberCount(int groupId) {
        return getMemberIds(groupId).size();
    }

    public List<User> getGroupMembers(int groupId) {
        List<User> members = new ArrayList<>();
        String sql = "SELECT u.id, u.name, u.email, u.password_hash FROM users u " +
                "INNER JOIN group_members gm ON u.id = gm.user_id " +
                "WHERE gm.group_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, groupId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    members.add(new User(
                            rs.getInt("id"),
                            rs.getString("name"),
                            rs.getString("email"),
                            rs.getString("password_hash")
                    ));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return members;
    }

    public boolean deleteGroup(int groupId) {
        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false);

            try (PreparedStatement ps = conn.prepareStatement(
                    "DELETE FROM expense_splits WHERE expense_id IN (SELECT id FROM expenses WHERE group_id = ?)")) {
                ps.setInt(1, groupId);
                ps.executeUpdate();
            }

            try (PreparedStatement ps = conn.prepareStatement("DELETE FROM expenses WHERE group_id = ?")) {
                ps.setInt(1, groupId);
                ps.executeUpdate();
            }

            try (PreparedStatement ps = conn.prepareStatement("DELETE FROM settlements WHERE group_id = ?")) {
                ps.setInt(1, groupId);
                ps.executeUpdate();
            }

            try (PreparedStatement ps = conn.prepareStatement("DELETE FROM group_members WHERE group_id = ?")) {
                ps.setInt(1, groupId);
                ps.executeUpdate();
            }

            int deleted;
            try (PreparedStatement ps = conn.prepareStatement("DELETE FROM groups_table WHERE id = ?")) {
                ps.setInt(1, groupId);
                deleted = ps.executeUpdate();
            }

            conn.commit();
            return deleted > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) { ex.printStackTrace(); }
            }
            return false;
        } finally {
            if (conn != null) {
                try { conn.close(); } catch (SQLException e) { e.printStackTrace(); }
            }
        }
    }
}
