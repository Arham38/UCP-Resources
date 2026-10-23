package com.expensesplitter.models;

/**
 * Model class representing a single debt settlement transaction.
 * "fromUser owes toUser the given amount."
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.models
 */
public class Settlement {
    private int id;
    private int groupId;
    private int fromUserId;   // The person who owes money
    private int toUserId;     // The person who should receive money
    private double amount;    // Amount to be paid
    private boolean settled;  // Whether this debt has been cleared

    /** Default constructor */
    public Settlement() {}

    /** Parameterized constructor */
    public Settlement(int groupId, int fromUserId, int toUserId, double amount) {
        this.groupId = groupId;
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.amount = amount;
        this.settled = false;
    }

    // ── Getters & Setters ────────────────────────
    public int getId()                   { return id; }
    public void setId(int id)            { this.id = id; }

    public int getGroupId()              { return groupId; }
    public void setGroupId(int gid)      { this.groupId = gid; }

    public int getFromUserId()           { return fromUserId; }
    public void setFromUserId(int uid)   { this.fromUserId = uid; }

    public int getToUserId()             { return toUserId; }
    public void setToUserId(int uid)     { this.toUserId = uid; }

    public double getAmount()            { return amount; }
    public void setAmount(double amt)    { this.amount = amt; }

    public boolean isSettled()           { return settled; }
    public void setSettled(boolean s)    { this.settled = s; }

    @Override
    public String toString() {
        return "Settlement{from=" + fromUserId + ", to=" + toUserId +
               ", amount=" + amount + ", settled=" + settled + "}";
    }
}
