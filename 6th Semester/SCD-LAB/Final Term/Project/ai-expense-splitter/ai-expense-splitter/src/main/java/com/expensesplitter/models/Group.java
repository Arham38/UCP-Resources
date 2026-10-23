package com.expensesplitter.models;

import java.util.List;
import java.util.ArrayList;

/**
 * Model class representing an expense group (e.g. Roommates, Trip Group).
 * Each group has its own member list and expense ledger.
 * Demonstrates ENCAPSULATION — all fields are private with public getters/setters.
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.models
 */
public class Group {
    
    /** Unique identifier for the group in the database. */
    private int id;
    
    /** The name of the group. */
    private String name;
    
    /** A short description of the group's purpose. */
    private String description;
    
    /** User ID of the user who created the group. */
    private int createdBy;
    
    /** List of users registered as members in this group. */
    private List<User> members;

    /**
     * Default constructor.
     * Initializes an empty list of members.
     */
    public Group() {
        this.members = new ArrayList<>();
    }

    /**
     * Parameterized constructor for clean group instantiation.
     *
     * @param id          Unique identifier for the group.
     * @param name        The name of the group.
     * @param description A short description of the group's purpose.
     * @param createdBy   User ID of the group creator.
     */
    public Group(int id, String name, String description, int createdBy) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdBy = createdBy;
        this.members = new ArrayList<>();
    }

    /**
     * Gets the unique identifier of the group.
     *
     * @return The group ID.
     */
    public int getId() { 
        return id; 
    }

    /**
     * Sets the unique identifier of the group.
     *
     * @param id The new group ID.
     */
    public void setId(int id) { 
        this.id = id; 
    }

    /**
     * Gets the name of the group.
     *
     * @return The group name.
     */
    public String getName() { 
        return name; 
    }

    /**
     * Sets the name of the group.
     *
     * @param name The new name of the group.
     */
    public void setName(String name) { 
        this.name = name; 
    }

    /**
     * Gets the description of the group's purpose.
     *
     * @return The description.
     */
    public String getDescription() { 
        return description; 
    }

    /**
     * Sets the description of the group's purpose.
     *
     * @param desc The new description.
     */
    public void setDescription(String desc) { 
        this.description = desc; 
    }

    /**
     * Gets the user ID of the group creator.
     *
     * @return The creator's user ID.
     */
    public int getCreatedBy() { 
        return createdBy; 
    }

    /**
     * Sets the user ID of the group creator.
     *
     * @param createdBy The new creator's user ID.
     */
    public void setCreatedBy(int createdBy) { 
        this.createdBy = createdBy; 
    }

    /**
     * Gets the list of users registered as members in this group.
     *
     * @return A list of User objects.
     */
    public List<User> getMembers() { 
        return members; 
    }

    /**
     * Sets the list of users registered as members in this group.
     *
     * @param m The new list of members.
     */
    public void setMembers(List<User> m) { 
        this.members = m; 
    }

    /**
     * Adds a single member to the group's member list.
     *
     * @param user The User object to add.
     */
    public void addMember(User user) {
        this.members.add(user);
    }

    /**
     * Returns a string representation of the Group object, including the number of members.
     *
     * @return A string representation of the Group.
     */
    @Override
    public String toString() {
        return name + " (" + members.size() + " members)";
    }
}
