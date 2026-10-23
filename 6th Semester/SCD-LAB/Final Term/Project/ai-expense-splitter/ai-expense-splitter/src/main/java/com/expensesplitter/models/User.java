package com.expensesplitter.models;

/**
 * Model class representing a registered user in the system.
 * Demonstrates ENCAPSULATION — all fields are private with public getters/setters.
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.models
 */
public class User {
    
    /** Unique identifier for the user in the database. */
    private int id;
    
    /** The full name of the user. */
    private String name;
    
    /** The unique email address of the user. */
    private String email;
    
    /** The SHA-256 hashed password of the user, never stored in plain text. */
    private String passwordHash;

    /**
     * Default constructor.
     * Creates an uninitialized User object.
     */
    public User() {}

    /**
     * Parameterized constructor for clean object creation.
     *
     * @param id           Unique identifier for the user.
     * @param name         The full name of the user.
     * @param email        The unique email address of the user.
     * @param passwordHash The SHA-256 hashed password.
     */
    public User(int id, String name, String email, String passwordHash) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    /**
     * Gets the unique identifier of the user.
     *
     * @return The user ID.
     */
    public int getId() { 
        return id; 
    }

    /**
     * Gets the full name of the user.
     *
     * @return The user's name.
     */
    public String getName() { 
        return name; 
    }

    /**
     * Gets the unique email address of the user.
     *
     * @return The user's email.
     */
    public String getEmail() { 
        return email; 
    }

    /**
     * Gets the SHA-256 hashed password of the user.
     *
     * @return The user's password hash.
     */
    public String getPasswordHash() { 
        return passwordHash; 
    }

    /**
     * Sets the unique identifier of the user.
     *
     * @param id The new user ID.
     */
    public void setId(int id) { 
        this.id = id; 
    }

    /**
     * Sets the full name of the user.
     *
     * @param name The new name of the user.
     */
    public void setName(String name) { 
        this.name = name; 
    }

    /**
     * Sets the unique email address of the user.
     *
     * @param email The new email address of the user.
     */
    public void setEmail(String email) { 
        this.email = email; 
    }

    /**
     * Sets the SHA-256 hashed password of the user.
     *
     * @param hash The new password hash.
     */
    public void setPasswordHash(String hash) { 
        this.passwordHash = hash; 
    }

    /**
     * Overrides the toString method to provide a safe representation of the User object,
     * excluding the sensitive password hash for security.
     *
     * @return A string representation of the User.
     */
    @Override
    public String toString() {
        return "User{id=" + id + ", name='" + name + "', email='" + email + "'}";
    }
}
