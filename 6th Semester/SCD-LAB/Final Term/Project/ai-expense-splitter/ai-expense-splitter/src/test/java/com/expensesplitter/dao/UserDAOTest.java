package com.expensesplitter.dao;

import com.expensesplitter.models.User;
import com.expensesplitter.utils.DatabaseConnection;
import com.expensesplitter.utils.PasswordHasher;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import static org.junit.Assert.*;

/**
 * Unit and Integration tests for UserDAO.
 * Verifies insertion, retrieval, update, deletion, and password hashing integration.
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.dao
 */
public class UserDAOTest {

    private UserDAO userDAO;
    private User testUser;

    @Before
    public void setUp() throws SQLException {
        userDAO = new UserDAO();
        
        // Clean up any existing test user with the same email to ensure a clean state
        cleanUpTestUser("test_arham@example.com");
        
        // Prepare a fresh test user object
        String passwordHash = PasswordHasher.hashPassword("SecurePassword123");
        testUser = new User(0, "Muhammad Arham", "test_arham@example.com", passwordHash);
    }

    @After
    public void tearDown() throws SQLException {
        // Clean up the created test user to leave the database in a clean state
        cleanUpTestUser("test_arham@example.com");
        cleanUpTestUser("updated_arham@example.com");
    }

    private void cleanUpTestUser(String email) throws SQLException {
        String sql = "DELETE FROM Users WHERE email = '" + email + "'";
        try (Connection conn = DatabaseConnection.getInstance();
             Statement stmt = conn.createStatement()) {
            stmt.executeUpdate(sql);
        }
    }

    /**
     * Test password hashing and verification logic.
     */
    @Test
    public void testPasswordHashing() {
        String rawPassword = "mySecretPassword";
        String hashed = PasswordHasher.hashPassword(rawPassword);
        
        assertNotNull("Hashed password should not be null", hashed);
        assertEquals("Hashed password must be 64 characters long (SHA-256)", 64, hashed.length());
        
        // Verify verification method matches correct password
        assertTrue("Password verification should succeed", PasswordHasher.verifyPassword(rawPassword, hashed));
        // Verify verification method fails incorrect password
        assertFalse("Password verification should fail for wrong password", PasswordHasher.verifyPassword("wrongPassword", hashed));
    }

    /**
     * Tests full CRUD operations of the UserDAO.
     */
    @Test
    public void testUserCRUD() throws SQLException {
        // 1. Create (Insert)
        boolean isCreated = userDAO.createUser(testUser);
        assertTrue("User creation should return true", isCreated);
        assertTrue("User ID should be populated after insert", testUser.getId() > 0);

        // 2. Read by Email
        User fetchedByEmail = userDAO.getUserByEmail(testUser.getEmail());
        assertNotNull("Fetched user by email should not be null", fetchedByEmail);
        assertEquals("Name should match", testUser.getName(), fetchedByEmail.getName());
        assertEquals("Email should match", testUser.getEmail(), fetchedByEmail.getEmail());
        assertEquals("Password hash should match", testUser.getPasswordHash(), fetchedByEmail.getPasswordHash());

        // 3. Read by ID
        User fetchedById = userDAO.getUserById(testUser.getId());
        assertNotNull("Fetched user by ID should not be null", fetchedById);
        assertEquals("Name should match", testUser.getName(), fetchedById.getName());

        // 4. Update
        fetchedById.setName("Arham Bhatti");
        fetchedById.setEmail("updated_arham@example.com");
        boolean isUpdated = userDAO.updateUser(fetchedById);
        assertTrue("User update should return true", isUpdated);

        User updatedUser = userDAO.getUserById(fetchedById.getId());
        assertNotNull("Updated user should exist", updatedUser);
        assertEquals("Updated name should match", "Arham Bhatti", updatedUser.getName());
        assertEquals("Updated email should match", "updated_arham@example.com", updatedUser.getEmail());

        // 5. Get All Users
        List<User> allUsers = userDAO.getAllUsers();
        assertFalse("Users list should not be empty", allUsers.isEmpty());
        boolean found = allUsers.stream().anyMatch(u -> u.getId() == testUser.getId());
        assertTrue("List should contain our test user", found);

        // 6. Delete
        boolean isDeleted = userDAO.deleteUser(testUser.getId());
        assertTrue("User deletion should return true", isDeleted);

        User deletedUser = userDAO.getUserById(testUser.getId());
        assertNull("User should not be found after deletion", deletedUser);
    }
}
