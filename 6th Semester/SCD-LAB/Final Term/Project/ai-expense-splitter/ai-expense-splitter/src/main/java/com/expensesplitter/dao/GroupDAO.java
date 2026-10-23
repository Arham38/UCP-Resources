package com.expensesplitter.dao;

import com.expensesplitter.models.Group;
import com.expensesplitter.models.User;
import com.expensesplitter.utils.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object (DAO) for the Groups and GroupMembers tables.
 * Handles database operations for creating, retrieving, updating, and deleting groups,
 * as well as managing members within groups.
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.dao
 */
public class GroupDAO {

    /**
     * Creates a new expense group in the Groups table.
     * Uses a SQL transaction to automatically insert the group creator as the first member.
     *
     * @param group the Group object containing name, description, and creator user ID
     * @return true if the group was successfully created and creator enrolled, false otherwise
     * @throws SQLException if a database access error occurs
     */
    public boolean createGroup(Group group) throws SQLException {
        String insertGroupSql = "INSERT INTO Groups (name, description, created_by) VALUES (?, ?, ?)";
        String insertMemberSql = "INSERT INTO GroupMembers (group_id, user_id) VALUES (?, ?)";

        Connection conn = null;
        try {
            conn = DatabaseConnection.getInstance();
            conn.setAutoCommit(false);

            try (PreparedStatement psGroup = conn.prepareStatement(insertGroupSql, Statement.RETURN_GENERATED_KEYS)) {
                psGroup.setString(1, group.getName());
                psGroup.setString(2, group.getDescription());
                psGroup.setInt(3, group.getCreatedBy());

                int affectedRows = psGroup.executeUpdate();

                if (affectedRows > 0) {
                    try (ResultSet rs = psGroup.getGeneratedKeys()) {
                        if (rs.next()) {
                            group.setId(rs.getInt(1));
                        }
                    }

                    try (PreparedStatement psMember = conn.prepareStatement(insertMemberSql)) {
                        psMember.setInt(1, group.getId());
                        psMember.setInt(2, group.getCreatedBy());
                        psMember.executeUpdate();
                    }

                    conn.commit();
                    return true;
                }
            } catch (SQLException e) {
                if (conn != null) {
                    conn.rollback();
                }
                throw e;
            }
        } finally {
            if (conn != null) {
                conn.setAutoCommit(true);
            }
        }
        return false;
    }

    /**
     * Retrieves a group by ID with all members loaded.
     *
     * @param id the unique primary key ID of the group
     * @return the Group object with members list filled, or null if not found
     * @throws SQLException if a database access error occurs
     */
    public Group getGroupById(int id) throws SQLException {
        String groupSql = "SELECT id, name, description, created_by FROM Groups WHERE id = ?";
        String membersSql = "SELECT u.id, u.name, u.email, u.password_hash " +
                "FROM Users u " +
                "JOIN GroupMembers gm ON u.id = gm.user_id " +
                "WHERE gm.group_id = ? " +
                "ORDER BY u.name";

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement psGroup = conn.prepareStatement(groupSql)) {

            psGroup.setInt(1, id);

            try (ResultSet rsGroup = psGroup.executeQuery()) {
                if (!rsGroup.next()) {
                    return null;
                }

                // Build group from first query
                Group group = new Group(
                        rsGroup.getInt("id"),
                        rsGroup.getString("name"),
                        rsGroup.getString("description"),
                        rsGroup.getInt("created_by")
                );

                // Load all members — always initialize a non-null list
                List<User> members = new ArrayList<>();
                try (PreparedStatement psMembers = conn.prepareStatement(membersSql)) {
                    psMembers.setInt(1, id);
                    try (ResultSet rsMembers = psMembers.executeQuery()) {
                        while (rsMembers.next()) {
                            members.add(new User(
                                    rsMembers.getInt("id"),
                                    rsMembers.getString("name"),
                                    rsMembers.getString("email"),
                                    rsMembers.getString("password_hash")
                            ));
                        }
                    }
                }
                group.setMembers(members);

                System.out.println("Group " + id + " has " + members.size() + " members");
                return group;
            }
        }
    }

    /**
     * Retrieves all groups the specified user belongs to.
     * Returns only groups with valid non-empty names — never null entries.
     *
     * @param userId the unique ID of the user
     * @return list of Group objects ordered by name
     * @throws SQLException if a database access error occurs
     */
    public List<Group> getGroupsByUser(int userId) throws SQLException {
        String sql = "SELECT g.id, g.name " +
                "FROM Groups g " +
                "JOIN GroupMembers gm ON g.id = gm.group_id " +
                "WHERE gm.user_id = ? " +
                "ORDER BY g.name";

        List<Group> groups = new ArrayList<>();
        List<Integer> groupIds = new ArrayList<>();

        // Step 1: Collect group IDs while ResultSet is open
        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, userId);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    String name = rs.getString("name");
                    if (name == null || name.trim().isEmpty()) {
                        continue;
                    }
                    groupIds.add(rs.getInt("id"));
                }
            }
        }

        // Step 2: Load full groups AFTER ResultSet is closed
        // (calling getGroupById inside the loop closes the shared connection's ResultSet)
        for (Integer groupId : groupIds) {
            Group fullGroup = getGroupById(groupId);
            if (fullGroup != null && fullGroup.getName() != null && !fullGroup.getName().trim().isEmpty()) {
                groups.add(fullGroup);
            }
        }

        System.out.println("Groups loaded for user " + userId + ": " + groups.size());
        return groups;
    }

    /**
     * Adds a user to a group.
     *
     * @param groupId the group ID
     * @param userId  the user ID to add
     * @return true if successful
     * @throws SQLException if a database access error occurs
     */
    public boolean addMember(int groupId, int userId) throws SQLException {
        String sql = "INSERT INTO GroupMembers (group_id, user_id) VALUES (?, ?)";

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, groupId);
            ps.setInt(2, userId);
            return ps.executeUpdate() > 0;
        }
    }

    /**
     * Removes a user from a group.
     *
     * @param groupId the group ID
     * @param userId  the user ID to remove
     * @return true if successful
     * @throws SQLException if a database access error occurs
     */
    public boolean removeMember(int groupId, int userId) throws SQLException {
        String sql = "DELETE FROM GroupMembers WHERE group_id = ? AND user_id = ?";

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, groupId);
            ps.setInt(2, userId);
            return ps.executeUpdate() > 0;
        }
    }

    /**
     * Updates group name and description.
     *
     * @param group the group with updated values
     * @return true if successful
     * @throws SQLException if a database access error occurs
     */
    public boolean updateGroup(Group group) throws SQLException {
        String sql = "UPDATE Groups SET name = ?, description = ? WHERE id = ?";

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, group.getName());
            ps.setString(2, group.getDescription());
            ps.setInt(3, group.getId());
            return ps.executeUpdate() > 0;
        }
    }

    /**
     * Deletes a group by ID.
     *
     * @param id the group ID
     * @return true if successful
     * @throws SQLException if a database access error occurs
     */
    public boolean deleteGroup(int id) throws SQLException {
        String sql = "DELETE FROM Groups WHERE id = ?";

        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }
}
