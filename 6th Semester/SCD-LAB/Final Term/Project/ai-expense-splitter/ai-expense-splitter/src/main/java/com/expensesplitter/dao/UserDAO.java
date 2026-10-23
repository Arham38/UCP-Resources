package com.expensesplitter.dao;

import com.expensesplitter.models.User;
import com.expensesplitter.utils.DatabaseConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object (DAO) for the Users table.
 * Handles all database operations (Create, Read, Update, Delete) for User entities.
 * Encapsulates the database access logic, shielding the rest of the application
 * from direct SQL operations and demonstrating encapsulation.
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.dao
 */
public class UserDAO {

    /**
     * Inserts a new user record into the Users table.
     * Uses PreparedStatement to prevent SQL injection. Sets the generated auto-increment ID
     * back into the User object upon successful insertion.
     *
     * @param user the User object containing details to insert (name, email, passwordHash)
     * @return true if the user was successfully created, false otherwise
     * @throws SQLException if a database access error occurs or the email already exists
     */
    public boolean createUser(User user) throws SQLException {
        String sql = "INSERT INTO Users (name, email, password_hash) VALUES (?, ?, ?)";
        
        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            ps.setString(1, user.getName());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPasswordHash());
            
            int affectedRows = ps.executeUpdate();
            
            if (affectedRows > 0) {
                // Retrieve the auto-generated database primary key (ID) and assign it to the user object
                try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        user.setId(generatedKeys.getInt(1));
                    }
                }
                return true;
            }
        }
        return false;
    }

    /**
     * Retrieves a user from the database by their email address.
     * Used typically during login to check credentials and load session information.
     *
     * @param email the email address of the user to retrieve
     * @return the User object if found, or null if no user matches the email
     * @throws SQLException if a database access error occurs
     */
    public User getUserByEmail(String email) throws SQLException {
        String sql = "SELECT id, name, email, password_hash FROM Users WHERE email = ?";
        
        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, email);
            
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new User(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getString("password_hash")
                    );
                }
            }
        }
        return null;
    }

    /**
     * Retrieves a user from the database by their unique ID.
     *
     * @param id the unique ID of the user to retrieve
     * @return the User object if found, or null if no user matches the ID
     * @throws SQLException if a database access error occurs
     */
    public User getUserById(int id) throws SQLException {
        String sql = "SELECT id, name, email, password_hash FROM Users WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, id);
            
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new User(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getString("password_hash")
                    );
                }
            }
        }
        return null;
    }

    /**
     * Updates an existing user's details (name, email, and password hash) in the database.
     *
     * @param user the User object containing the updated information and identifying ID
     * @return true if the user record was updated successfully, false otherwise
     * @throws SQLException if a database access error occurs
     */
    public boolean updateUser(User user) throws SQLException {
        String sql = "UPDATE Users SET name = ?, email = ?, password_hash = ? WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, user.getName());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPasswordHash());
            ps.setInt(4, user.getId());
            
            return ps.executeUpdate() > 0;
        }
    }

    /**
     * Deletes a user record from the database by their unique ID.
     *
     * @param id the unique ID of the user to delete
     * @return true if the user was deleted successfully, false otherwise
     * @throws SQLException if a database access error occurs
     */
    public boolean deleteUser(int id) throws SQLException {
        String sql = "DELETE FROM Users WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, id);
            
            return ps.executeUpdate() > 0;
        }
    }

    /**
     * Retrieves all registered users from the database.
     *
     * @return a List containing all User objects registered in the system
     * @throws SQLException if a database access error occurs
     */
    public List<User> getAllUsers() throws SQLException {
        String sql = "SELECT id, name, email, password_hash FROM Users";
        List<User> users = new ArrayList<>();
        
        try (Connection conn = DatabaseConnection.getInstance();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            
            while (rs.next()) {
                users.add(new User(
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getString("email"),
                    rs.getString("password_hash")
                ));
            }
        }
        return users;
    }
}
