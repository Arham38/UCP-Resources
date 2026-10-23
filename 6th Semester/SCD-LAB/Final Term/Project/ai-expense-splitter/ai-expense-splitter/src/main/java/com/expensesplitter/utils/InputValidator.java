package com.expensesplitter.utils;

/**
 * Centralized input validation utility.
 * All form field validation is handled here to avoid code duplication.
 *
 * Methods:
 *   validateAmount()   — checks for valid positive number
 *   validateEmail()    — basic email format check
 *   validateName()     — non-empty name check
 *   validatePassword() — minimum length check
 *   isEmpty()          — null or blank check
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.utils
 */
public class InputValidator {

    /**
     * Validates that the input is a valid positive numeric amount.
     * Used on all expense amount fields.
     *
     * @param input  the string value from the text field
     * @return true if valid positive number, false otherwise
     */
    public static boolean validateAmount(String input) {
        if (input == null || input.trim().isEmpty()) return false;
        try {
            double value = Double.parseDouble(input.trim());
            return value > 0; // Amount must be greater than zero
        } catch (NumberFormatException e) {
            return false; // Not a number
        }
    }

    /**
     * Validates basic email format using regex.
     * Must contain @ and a domain.
     *
     * @param email  the email string to validate
     * @return true if valid email format
     */
    public static boolean validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) return false;
        // Simple regex: must have text@text.text
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    /**
     * Validates that a name field is not empty.
     *
     * @param name  the name string
     * @return true if non-empty
     */
    public static boolean validateName(String name) {
        return name != null && !name.trim().isEmpty();
    }

    /**
     * Validates password has minimum 6 characters.
     *
     * @param password  the password string
     * @return true if at least 6 characters
     */
    public static boolean validatePassword(String password) {
        return password != null && password.length() >= 6;
    }

    /**
     * Checks if a string is null or blank.
     *
     * @param value  any string value
     * @return true if null or blank
     */
    public static boolean isEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }
}
