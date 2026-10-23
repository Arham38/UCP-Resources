package com.expensesplitter.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Utility class for password hashing using the SHA-256 algorithm.
 * Passwords are NEVER stored in plain text in the database for security reasons.
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.utils
 */
public class PasswordHasher {

    /**
     * Hashes a plain text password using the SHA-256 hashing algorithm.
     * The result is a 64-character hexadecimal representation of the hash.
     *
     * @param password the plain text password to hash
     * @return SHA-256 hashed 64-character hex string, or null if hashing fails
     */
    public static String hashPassword(String password) {
        try {
            // Get SHA-256 MessageDigest instance
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            // Convert password string to bytes and generate the hash bytes
            byte[] hashBytes = digest.digest(password.getBytes());

            // Convert byte array to hexadecimal string representation
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                // Convert each byte to a hex string
                String hex = Integer.toHexString(0xff & b);
                // Pad with a leading zero if the hex string is single-character
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }

            // Return the complete 64-character hex string
            return hexString.toString();

        } catch (NoSuchAlgorithmException e) {
            // Log NoSuchAlgorithmException if SHA-256 is not supported on the runtime JVM
            System.err.println("SHA-256 algorithm not available: " + e.getMessage());
            return null;
        }
    }

    /**
     * Verifies if a plain text password matches a stored SHA-256 password hash.
     *
     * @param plain      the plain text password entered by the user
     * @param storedHash the SHA-256 hash stored in the database
     * @return true if the password matches the stored hash, false otherwise
     */
    public static boolean verifyPassword(String plain, String storedHash) {
        // Hash the plain text input using the same SHA-256 process
        String hashedInput = hashPassword(plain);
        
        // Return true if hashed input is not null and matches the stored hash exactly
        return hashedInput != null && hashedInput.equals(storedHash);
    }
}
