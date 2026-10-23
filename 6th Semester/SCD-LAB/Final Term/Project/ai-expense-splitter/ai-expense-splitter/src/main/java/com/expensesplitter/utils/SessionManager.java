package com.expensesplitter.utils;

import com.expensesplitter.models.User;

/**
 * Manages the currently logged-in user's session.
 * Uses SINGLETON pattern — only one session at a time.
 * Ensures secure access control across all screens.
 *
 * Methods:
 *   setCurrentUser() — saves logged-in user
 *   getCurrentUser() — retrieves logged-in user
 *   isLoggedIn()     — checks if a session is active
 *   clearSession()   — logs the user out
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.utils
 */
public class SessionManager {

    // The currently logged-in user (null if not logged in)
    private static User currentUser = null;

    /** Private constructor — Singleton, no instantiation needed */
    private SessionManager() {}

    /**
     * Sets the currently logged-in user after successful authentication.
     * Called immediately after login() succeeds.
     *
     * @param user  the authenticated User object
     */
    public static void setCurrentUser(User user) {
        currentUser = user;
    }

    /**
     * Returns the currently logged-in user.
     * Returns null if no user is logged in.
     *
     * @return current User or null
     */
    public static User getCurrentUser() {
        return currentUser;
    }

    /**
     * Checks if a user session is currently active.
     *
     * @return true if a user is logged in
     */
    public static boolean isLoggedIn() {
        return currentUser != null;
    }

    /**
     * Clears the current session — effectively logs the user out.
     * Called when the user clicks Logout.
     */
    public static void clearSession() {
        currentUser = null;
        System.out.println("Session cleared. User logged out.");
    }
}
