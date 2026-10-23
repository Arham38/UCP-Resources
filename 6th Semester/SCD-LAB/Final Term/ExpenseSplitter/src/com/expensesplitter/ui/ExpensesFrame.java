// FIXED: New expenses list page wired to sidebar and DB
package com.expensesplitter.ui;

import com.expensesplitter.Session;
import com.expensesplitter.dao.ExpenseDAO;
import com.expensesplitter.dao.GroupDAO;
import com.expensesplitter.models.Expense;
import com.expensesplitter.models.Group;
import com.expensesplitter.models.User;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ExpensesFrame extends JFrame {

    private JPanel expensesPanel;
    private JLabel emptyLabel;
    private final GroupDAO groupDAO = new GroupDAO();
    private final ExpenseDAO expenseDAO = new ExpenseDAO();

    public ExpensesFrame() {
        setTitle("Expense Splitter - Expenses");
        setSize(1200, 800);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        JPanel root = new JPanel(new BorderLayout());
        root.setBackground(new Color(248, 249, 250));
        root.add(AppSidebar.create(this, AppSidebar.Page.EXPENSES), BorderLayout.WEST);

        JPanel center = new JPanel(new BorderLayout());
        center.setOpaque(false);
        center.add(AppSidebar.createTopBar(this), BorderLayout.NORTH);
        center.add(buildMainContent(), BorderLayout.CENTER);
        root.add(center, BorderLayout.CENTER);
        add(root);

        refreshExpenses();
    }

    private JPanel buildMainContent() {
        JPanel main = new JPanel(new BorderLayout());
        main.setOpaque(false);
        main.setBorder(new EmptyBorder(28, 30, 30, 30));

        JLabel title = new JLabel("All Expenses");
        title.setFont(new Font("Segoe UI", Font.BOLD, 24));
        JLabel subtitle = new JLabel("View and manage expenses from all your groups with calculated splits.");
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        subtitle.setForeground(Color.GRAY);

        JPanel titleArea = new JPanel();
        titleArea.setLayout(new BoxLayout(titleArea, BoxLayout.Y_AXIS));
        titleArea.setOpaque(false);
        titleArea.add(title);
        titleArea.add(Box.createVerticalStrut(4));
        titleArea.add(subtitle);

        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);
        header.setBorder(new EmptyBorder(0, 0, 20, 0));
        header.add(titleArea, BorderLayout.WEST);
        header.add(UiStyles.primaryButton("+ Add Expense", () ->
                new ExpenseDialog(this).setVisible(true)), BorderLayout.EAST);

        expensesPanel = new JPanel();
        expensesPanel.setLayout(new BoxLayout(expensesPanel, BoxLayout.Y_AXIS));
        expensesPanel.setOpaque(false);

        emptyLabel = new JLabel("No expenses yet. Click \"+ Add Expense\" to record one.");
        emptyLabel.setFont(new Font("Segoe UI", Font.PLAIN, 15));
        emptyLabel.setForeground(new Color(120, 130, 145));
        emptyLabel.setAlignmentX(Component.LEFT_ALIGNMENT);

        JPanel scroll = new JPanel(new BorderLayout());
        scroll.setOpaque(false);
        JScrollPane scrollPane = new JScrollPane(expensesPanel);
        scrollPane.setBorder(null);
        scrollPane.getViewport().setBackground(new Color(248, 249, 250));
        scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);

        main.add(header, BorderLayout.NORTH);
        main.add(scrollPane, BorderLayout.CENTER);
        return main;
    }

    public void refreshExpenses() {
        expensesPanel.removeAll();
        User user = Session.getCurrentUser();
        if (user == null) {
            expensesPanel.add(emptyLabel);
            expensesPanel.revalidate();
            expensesPanel.repaint();
            return;
        }

        List<Group> userGroups = groupDAO.getGroupsByUser(user.getId());
        List<Expense> allExpenses = new java.util.ArrayList<>();
        Map<Integer, String> groupNames = new HashMap<>();
        Map<Integer, Integer> groupMemberCounts = new HashMap<>();

        for (Group g : userGroups) {
            groupNames.put(g.getId(), g.getName());
            groupMemberCounts.put(g.getId(), groupDAO.getMemberCount(g.getId()));
            allExpenses.addAll(expenseDAO.getExpensesByGroup(g.getId()));
        }

        if (allExpenses.isEmpty()) {
            expensesPanel.add(emptyLabel);
        } else {
            for (Expense expense : allExpenses) {
                expensesPanel.add(createExpenseCard(expense, groupNames, groupMemberCounts, user.getId()));
                expensesPanel.add(Box.createVerticalStrut(12));
            }
        }

        expensesPanel.revalidate();
        expensesPanel.repaint();
    }

    private JPanel createExpenseCard(Expense expense, Map<Integer, String> groupNames, 
                                     Map<Integer, Integer> memberCounts, int currentUserId) {
        JPanel card = new JPanel(new BorderLayout());
        card.setBackground(Color.WHITE);
        card.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(220, 220, 220)),
                new EmptyBorder(16, 16, 16, 16)));
        card.setMaximumSize(new Dimension(Integer.MAX_VALUE, 200));

        String groupName = groupNames.getOrDefault(expense.getGroupId(), "Group");
        User payer = new com.expensesplitter.dao.UserDAO().getUserById(expense.getPaidBy());
        String payerName = payer != null ? payer.getName() : "Unknown";
        int memberCount = memberCounts.getOrDefault(expense.getGroupId(), 1);
        double perPersonShare = expense.getAmount() / memberCount;

        // Top section: Expense info
        JPanel topSection = new JPanel(new BorderLayout());
        topSection.setOpaque(false);

        JPanel leftTop = new JPanel();
        leftTop.setLayout(new BoxLayout(leftTop, BoxLayout.Y_AXIS));
        leftTop.setOpaque(false);

        JLabel descLbl = new JLabel(expense.getDescription());
        descLbl.setFont(new Font("Segoe UI", Font.BOLD, 16));
        
        JLabel payerLbl = new JLabel("💳 " + payerName + " paid");
        payerLbl.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        payerLbl.setForeground(new Color(100, 110, 125));

        leftTop.add(descLbl);
        leftTop.add(Box.createVerticalStrut(4));
        leftTop.add(payerLbl);

        JLabel amountLbl = new JLabel(String.format("Rs. %.2f", expense.getAmount()));
        amountLbl.setFont(new Font("Segoe UI Mono", Font.BOLD, 18));
        amountLbl.setForeground(new Color(0, 102, 204));

        topSection.add(leftTop, BorderLayout.WEST);
        topSection.add(amountLbl, BorderLayout.EAST);

        // Middle: Group & Date
        JPanel middleSection = new JPanel(new FlowLayout(FlowLayout.LEFT, 16, 0));
        middleSection.setOpaque(false);

        JLabel groupBadge = new JLabel("📁 " + groupName);
        groupBadge.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        groupBadge.setForeground(new Color(80, 100, 140));

        JLabel dateBadge = new JLabel("📅 " + (expense.getDate() != null ? expense.getDate().toString() : "N/A"));
        dateBadge.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        dateBadge.setForeground(new Color(80, 100, 140));

        middleSection.add(groupBadge);
        middleSection.add(dateBadge);

        // Bottom: Split breakdown
        JPanel bottomSection = new JPanel();
        bottomSection.setLayout(new BoxLayout(bottomSection, BoxLayout.Y_AXIS));
        bottomSection.setOpaque(false);
        bottomSection.setBorder(new EmptyBorder(12, 0, 0, 0));

        JLabel splitTitle = new JLabel("Split among " + memberCount + " members:");
        splitTitle.setFont(new Font("Segoe UI", Font.BOLD, 11));
        splitTitle.setForeground(new Color(60, 70, 85));
        bottomSection.add(splitTitle);

        List<com.expensesplitter.models.User> members = groupDAO.getGroupMembers(expense.getGroupId());
        for (com.expensesplitter.models.User member : members) {
            JPanel memberRow = new JPanel(new BorderLayout());
            memberRow.setOpaque(false);
            memberRow.setBorder(new EmptyBorder(4, 12, 4, 0));
            memberRow.setMaximumSize(new Dimension(Integer.MAX_VALUE, 22));

            String memberLabel = member.getId() == expense.getPaidBy() ? 
                    "✓ " + member.getName() + " (paid)" : 
                    "◦ " + member.getName();
            
            JLabel memberLbl = new JLabel(memberLabel);
            memberLbl.setFont(new Font("Segoe UI", Font.PLAIN, 11));
            memberLbl.setForeground(new Color(100, 110, 125));

            JLabel memberAmountLbl = new JLabel(String.format("Rs. %.2f", perPersonShare));
            memberAmountLbl.setFont(new Font("Segoe UI", Font.PLAIN, 11));
            memberAmountLbl.setForeground(new Color(80, 100, 140));

            memberRow.add(memberLbl, BorderLayout.WEST);
            memberRow.add(memberAmountLbl, BorderLayout.EAST);
            bottomSection.add(memberRow);
        }

        card.add(topSection, BorderLayout.NORTH);
        card.add(middleSection, BorderLayout.CENTER);
        card.add(bottomSection, BorderLayout.SOUTH);

        return card;
    }
}
