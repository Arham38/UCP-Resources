// FIXED: Shared sidebar navigation and top bar
package com.expensesplitter.ui;

import com.expensesplitter.Session;
import com.expensesplitter.dao.ExpenseDAO;
import com.expensesplitter.dao.GroupDAO;
import com.expensesplitter.dao.SettlementDAO;
import com.expensesplitter.dao.UserDAO;
import com.expensesplitter.models.Expense;
import com.expensesplitter.models.Group;
import com.expensesplitter.models.Settlement;
import com.expensesplitter.models.User;

import javax.swing.*;
import javax.swing.border.*;
import java.awt.*;
import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SettlementFrame extends JFrame {

    private JPanel settlementsPanel;
    private GroupDAO groupDAO = new GroupDAO();
    private ExpenseDAO expenseDAO = new ExpenseDAO();
    private SettlementDAO settlementDAO = new SettlementDAO();
    private UserDAO userDAO = new UserDAO();

    public SettlementFrame() {
        setTitle("Settlements - Expense Splitter");
        setSize(1280, 900);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        JPanel root = new JPanel(new BorderLayout());
        root.setBackground(new Color(248, 249, 250));

        root.add(AppSidebar.create(this, AppSidebar.Page.SETTLEMENTS), BorderLayout.WEST);

        JPanel center = new JPanel(new BorderLayout());
        center.setOpaque(false);
        center.add(AppSidebar.createTopBar(this), BorderLayout.NORTH);
        center.add(createMainContent(), BorderLayout.CENTER);

        root.add(center, BorderLayout.CENTER);
        add(root);

        refreshSettlements();
    }

    private JPanel createMainContent() {
        JPanel main = new JPanel(new BorderLayout());
        main.setOpaque(false);
        main.setBorder(new EmptyBorder(28, 30, 28, 30));

        JLabel title = new JLabel("Settlements");
        title.setFont(new Font("Segoe UI", Font.BOLD, 24));
        JLabel subtitle = new JLabel("Resolve outstanding balances across all your groups.");
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 13));
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

        settlementsPanel = new JPanel();
        settlementsPanel.setLayout(new BoxLayout(settlementsPanel, BoxLayout.Y_AXIS));
        settlementsPanel.setOpaque(false);

        JScrollPane scroll = new JScrollPane(settlementsPanel);
        scroll.setBorder(null);
        scroll.getViewport().setBackground(new Color(248, 249, 250));
        scroll.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);

        main.add(header, BorderLayout.NORTH);
        main.add(scroll, BorderLayout.CENTER);
        return main;
    }

    private void refreshSettlements() {
        settlementsPanel.removeAll();
        User user = Session.getCurrentUser();
        if (user == null) {
            settlementsPanel.add(createEmptyLabel("Please log in to view settlements."));
            settlementsPanel.revalidate();
            settlementsPanel.repaint();
            return;
        }

        List<Group> userGroups = groupDAO.getGroupsByUser(user.getId());
        if (userGroups.isEmpty()) {
            settlementsPanel.add(createEmptyLabel("No groups found. Create a group to get started."));
            settlementsPanel.revalidate();
            settlementsPanel.repaint();
            return;
        }

        boolean hasSettlements = false;
        for (Group group : userGroups) {
            JPanel groupSettlementPanel = createGroupSettlementPanel(group, user.getId());
            if (groupSettlementPanel != null) {
                hasSettlements = true;
                settlementsPanel.add(groupSettlementPanel);
                settlementsPanel.add(Box.createVerticalStrut(16));
            }
        }

        if (!hasSettlements) {
            settlementsPanel.add(createEmptyLabel("All expenses are settled! 🎉"));
        }

        settlementsPanel.revalidate();
        settlementsPanel.repaint();
    }

    private JPanel createGroupSettlementPanel(Group group, int userId) {
        Map<Integer, Double> balances = calculateGroupBalances(group.getId(), userId);
        
        if (balances.isEmpty()) {
            return null;
        }

        JPanel groupPanel = new JPanel();
        groupPanel.setLayout(new BoxLayout(groupPanel, BoxLayout.Y_AXIS));
        groupPanel.setOpaque(false);

        // Group title
        JLabel groupTitle = new JLabel("📁 " + group.getName());
        groupTitle.setFont(new Font("Segoe UI", Font.BOLD, 14));
        groupTitle.setAlignmentX(Component.LEFT_ALIGNMENT);
        groupPanel.add(groupTitle);
        groupPanel.add(Box.createVerticalStrut(8));

        // Settlement cards for this group
        List<User> members = groupDAO.getGroupMembers(group.getId());
        for (User member : members) {
            if (member.getId() == userId) continue;
            
            Double balance = balances.get(member.getId());
            if (balance != null && balance != 0) {
                groupPanel.add(createSettlementCard(member, balance, userId, group.getId()));
                groupPanel.add(Box.createVerticalStrut(8));
            }
        }

        return groupPanel;
    }

    private Map<Integer, Double> calculateGroupBalances(int groupId, int userId) {
        Map<Integer, Double> balances = new HashMap<>();
        List<Expense> expenses = expenseDAO.getExpensesByGroup(groupId);
        List<User> members = groupDAO.getGroupMembers(groupId);

        // Initialize all members
        for (User m : members) {
            balances.put(m.getId(), 0.0);
        }

        int memberCount = members.size();
        double perPersonShare = 0;

        // Calculate expenses split
        for (Expense expense : expenses) {
            perPersonShare = expense.getAmount() / memberCount;
            
            if (expense.getPaidBy() == userId) {
                // User paid, others owe them
                for (User m : members) {
                    if (m.getId() != userId) {
                        balances.put(m.getId(), balances.get(m.getId()) + perPersonShare);
                    }
                }
            } else {
                // User owes payer their share
                balances.put(expense.getPaidBy(), balances.get(expense.getPaidBy()) - perPersonShare);
            }
        }

        // Filter out zero balances
        Map<Integer, Double> result = new HashMap<>();
        for (Map.Entry<Integer, Double> entry : balances.entrySet()) {
            if (Math.abs(entry.getValue()) > 0.01) {
                result.put(entry.getKey(), entry.getValue());
            }
        }
        return result;
    }

    private JPanel createSettlementCard(User otherUser, double balance, int userId, int groupId) {
        JPanel card = new JPanel(new BorderLayout(12, 0));
        card.setBackground(Color.WHITE);
        card.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(220, 220, 220)),
                new EmptyBorder(12, 14, 12, 14)));
        card.setMaximumSize(new Dimension(Integer.MAX_VALUE, 60));

        boolean userOwes = balance < 0;
        double absBalance = Math.abs(balance);

        // Avatar
        JPanel avatar = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                Color bgColor = userOwes ? new Color(254, 226, 226) : new Color(219, 234, 254);
                g2.setColor(bgColor);
                g2.fillOval(0, 0, getWidth(), getHeight());
                g2.setColor(userOwes ? new Color(185, 28, 28) : new Color(29, 78, 216));
                g2.setFont(new Font("Segoe UI", Font.BOLD, 12));
                FontMetrics fm = g2.getFontMetrics();
                String initial = String.valueOf(otherUser.getName().charAt(0)).toUpperCase();
                g2.drawString(initial, (getWidth() - fm.stringWidth(initial)) / 2,
                        (getHeight() + fm.getAscent() - fm.getDescent()) / 2);
                g2.dispose();
            }
        };
        avatar.setPreferredSize(new Dimension(36, 36));
        avatar.setOpaque(false);

        // Text info
        JLabel nameLabel = new JLabel(otherUser.getName());
        nameLabel.setFont(new Font("Segoe UI", Font.BOLD, 13));

        String statusText = userOwes ? 
                "You owe Rs. " + String.format("%.2f", absBalance) :
                "Owes you Rs. " + String.format("%.2f", absBalance);
        
        JLabel statusLabel = new JLabel(statusText);
        statusLabel.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        statusLabel.setForeground(userOwes ? new Color(185, 28, 28) : new Color(29, 78, 216));

        JPanel textPanel = new JPanel();
        textPanel.setLayout(new BoxLayout(textPanel, BoxLayout.Y_AXIS));
        textPanel.setOpaque(false);
        textPanel.add(nameLabel);
        textPanel.add(statusLabel);

        card.add(avatar, BorderLayout.WEST);
        card.add(textPanel, BorderLayout.CENTER);

        // Action button - only show if user is owed money (not if user owes money)
        if (!userOwes) {
            JButton settleBtn = new JButton("Settle");
            settleBtn.setFont(new Font("Segoe UI", Font.PLAIN, 11));
            settleBtn.setBackground(new Color(29, 78, 216));
            settleBtn.setForeground(Color.WHITE);
            settleBtn.setBorderPainted(false);
            settleBtn.setFocusPainted(false);
            settleBtn.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
            settleBtn.addActionListener(e -> recordSettlement(userId, otherUser.getId(), groupId, absBalance));
            card.add(settleBtn, BorderLayout.EAST);
        }

        return card;
    }

    private void recordSettlement(int payerId, int payeeId, int groupId, double amount) {
        Date today = new Date(System.currentTimeMillis());
        Settlement settlement = new Settlement(groupId, payerId, payeeId, amount, today);
        
        String error = settlementDAO.addSettlementWithMessage(settlement);
        if (error == null) {
            JOptionPane.showMessageDialog(this,
                    "Settlement recorded successfully!",
                    "Success", JOptionPane.INFORMATION_MESSAGE);
            refreshSettlements();
        } else {
            JOptionPane.showMessageDialog(this,
                    "Failed to record settlement.\n" + error,
                    "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private JLabel createEmptyLabel(String text) {
        JLabel label = new JLabel(text);
        label.setFont(new Font("Segoe UI", Font.PLAIN, 15));
        label.setForeground(new Color(120, 130, 145));
        label.setAlignmentX(Component.LEFT_ALIGNMENT);
        label.setBorder(new EmptyBorder(40, 0, 40, 0));
        return label;
    }
}