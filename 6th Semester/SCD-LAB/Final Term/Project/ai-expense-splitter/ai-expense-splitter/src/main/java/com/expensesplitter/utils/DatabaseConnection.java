package com.expensesplitter.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Manages the MySQL database connection using the SINGLETON design pattern.
 * Only ONE connection instance is created throughout the application lifecycle.
 *
 * OOP Concept: SINGLETON pattern (single shared instance)
 * Update DB_NAME, DB_USER, DB_PASS before running.
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.utils
 */
public class DatabaseConnection {

    /**
     * MySQL database URL pointing to localhost at default port 3306
     * with the database name 'expense_splitter'.
     */
    private static final String DB_URL = "jdbc:mysql://localhost:3306/expense_splitter";

    /**
     * Database username configuration.
     * Default MySQL root user.
     */
    private static final String DB_USER = "root";

    /**
     * Database password configuration.
     * Replace with your local MySQL password.
     */
    private static final String DB_PASS = "";

    /**
     * The single shared Connection instance.
     * Volatile keyword guarantees visibility of changes to other threads.
     */
    private static volatile Connection instance = null;

    /**
     * Private constructor to prevent instantiation of this utility class.
     * Throws an AssertionError to prevent instantiation even via Reflection.
     */
    private DatabaseConnection() {
        throw new AssertionError("DatabaseConnection utility class cannot be instantiated.");
    }

    /**
     * Retrieves the single shared active connection to the MySQL database.
     * Implements double-checked locking for thread-safe lazy initialization.
     *
     * @return active MySQL Connection instance
     * @throws SQLException if a database access error occurs or connection fails
     */
    public static Connection getInstance() throws SQLException {
        // First check (no lock overhead if instance is already created)
        if (instance == null || instance.isClosed()) {
            // Synchronize block to prevent multiple threads from accessing simultaneously
            synchronized (DatabaseConnection.class) {
                // Second check (inside lock to handle race conditions)
                if (instance == null || instance.isClosed()) {
                    try {
                        // Dynamically load the MySQL JDBC Driver class
                        Class.forName("com.mysql.cj.jdbc.Driver");
                    } catch (ClassNotFoundException e) {
                        // Catch ClassNotFoundException and wrap it in an SQLException
                        throw new SQLException("MySQL JDBC Driver not found in classpath", e);
                    }
                    // Establish connection using configured credentials
                    instance = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
                    System.out.println("Database connected successfully.");
                }
            }
        }
        // Return the active single instance
        return instance;
    }

    /**
     * Safely closes the active database connection if it is open.
     * Resets the connection instance reference to null to allow subsequent reconnection.
     */
    public static synchronized void closeConnection() {
        try {
            // Check if connection exists and is currently open
            if (instance != null && !instance.isClosed()) {
                // Close the connection
                instance.close();
                System.out.println("Database connection closed.");
            }
        } catch (SQLException e) {
            // Log SQL exception during close operation
            System.err.println("Error closing connection: " + e.getMessage());
        } finally {
            // Explicitly reset the singleton instance to null
            instance = null;
        }
    }
}
