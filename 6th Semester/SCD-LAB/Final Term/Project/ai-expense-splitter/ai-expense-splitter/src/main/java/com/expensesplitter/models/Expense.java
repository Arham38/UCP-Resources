package com.expensesplitter.models;

import java.util.Date;

/**
 * Model class representing a single shared expense.
 * Stores all details: title, amount, payer, category, split type, and date.
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.models
 */
public class Expense {
    private int id;
    private String title;
    private double amount;
    private int groupId;
    private int paidBy;          // User ID of the person who paid
    private String category;     // Auto-predicted by Weka Naive Bayes
    private String splitType;    // "EQUAL", "PERCENTAGE", or "CUSTOM"
    private Date date;

    /** Default constructor */
    public Expense() {}

    /** Parameterized constructor */
    public Expense(int id, String title, double amount, int groupId,
                   int paidBy, String category, String splitType, Date date) {
        this.id = id;
        this.title = title;
        this.amount = amount;
        this.groupId = groupId;
        this.paidBy = paidBy;
        this.category = category;
        this.splitType = splitType;
        this.date = date;
    }

    // ── Getters & Setters ────────────────────────
    public int getId()                   { return id; }
    public void setId(int id)            { this.id = id; }

    public String getTitle()             { return title; }
    public void setTitle(String title)   { this.title = title; }

    public double getAmount()            { return amount; }
    public void setAmount(double amt)    { this.amount = amt; }

    public int getGroupId()              { return groupId; }
    public void setGroupId(int gid)      { this.groupId = gid; }

    public int getPaidBy()               { return paidBy; }
    public void setPaidBy(int uid)       { this.paidBy = uid; }

    public String getCategory()          { return category; }
    public void setCategory(String cat)  { this.category = cat; }

    public String getSplitType()              { return splitType; }
    public void setSplitType(String splitType){ this.splitType = splitType; }

    public Date getDate()                { return date; }
    public void setDate(Date date)       { this.date = date; }

    @Override
    public String toString() {
        return "Expense{id=" + id + ", title='" + title +
               "', amount=" + amount + ", splitType='" + splitType + "'}";
    }
}
