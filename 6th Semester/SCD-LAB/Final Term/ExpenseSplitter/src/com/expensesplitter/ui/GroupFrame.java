// FIXED: Empty state, DB-loaded cards, scroll panel, shared sidebar navigation
package com.expensesplitter.ui;

import com.expensesplitter.Session;
import com.expensesplitter.dao.GroupDAO;
import com.expensesplitter.models.Group;
import com.expensesplitter.models.User;
import com.expensesplitter.validation.InputValidator;

import javax.swing.*;
import javax.swing.border.*;
import java.awt.*;
import java.util.List;

public class GroupFrame extends JFrame {

    private JPanel gridPanel;
    private JLabel emptyLabel;
    private final GroupDAO groupDAO = new GroupDAO();

    public GroupFrame() {
        setTitle("Expense Splitter - Groups");
        setSize(1200, 800);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        JPanel root = new JPanel(new BorderLayout());
        root.setBackground(new Color(248, 249, 250));
        root.add(AppSidebar.create(this, AppSidebar.Page.GROUPS), BorderLayout.WEST);

        JPanel center = new JPanel(new BorderLayout());
        center.setOpaque(false);
        center.add(AppSidebar.createTopBar(this), BorderLayout.NORTH);
        center.add(buildMainContent(), BorderLayout.CENTER);
        root.add(center, BorderLayout.CENTER);
        add(root);

        refreshGroups();
    }

    private JPanel buildMainContent() {
        JPanel main = new JPanel(new BorderLayout());
        main.setOpaque(false);
        main.setBorder(new EmptyBorder(28, 30, 30, 30));

        JPanel titleArea = new JPanel();
        titleArea.setLayout(new BoxLayout(titleArea, BoxLayout.Y_AXIS));
        titleArea.setOpaque(false);
        JLabel title = new JLabel("Manage Groups");
        title.setFont(new Font("Segoe UI", Font.BOLD, 24));
        JLabel subtitle = new JLabel("View and manage your expense sharing groups.");
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        subtitle.setForeground(Color.GRAY);
        titleArea.add(title);
        titleArea.add(Box.createVerticalStrut(4));
        titleArea.add(subtitle);

        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);
        header.add(titleArea, BorderLayout.WEST);
        header.add(UiStyles.primaryButton("+ Create New Group", this::showCreateGroupDialog), BorderLayout.EAST);

        gridPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 20, 20));
        gridPanel.setOpaque(false);

        emptyLabel = new JLabel("No groups yet. Click \"+ Create New Group\" to get started.", SwingConstants.CENTER);
        emptyLabel.setFont(new Font("Segoe UI", Font.PLAIN, 15));
        emptyLabel.setForeground(new Color(120, 130, 145));
        emptyLabel.setBorder(new EmptyBorder(60, 0, 60, 0));

        JPanel gridWrapper = new JPanel(new BorderLayout());
        gridWrapper.setOpaque(false);
        gridWrapper.add(emptyLabel, BorderLayout.NORTH);
        gridWrapper.add(gridPanel, BorderLayout.CENTER);

        JScrollPane scroll = new JScrollPane(gridWrapper);
        scroll.setBorder(null);
        scroll.getViewport().setBackground(new Color(248, 249, 250));
        scroll.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);

        main.add(header, BorderLayout.NORTH);
        main.add(scroll, BorderLayout.CENTER);
        return main;
    }

    private void refreshGroups() {
        gridPanel.removeAll();
        User user = Session.getCurrentUser();
        if (user == null) {
            emptyLabel.setText("Please log in to view your groups.");
            emptyLabel.setVisible(true);
            gridPanel.revalidate();
            gridPanel.repaint();
            return;
        }

        List<Group> groups = groupDAO.getGroupsByUser(user.getId());
        emptyLabel.setVisible(groups.isEmpty());

        for (Group group : groups) {
            int members = groupDAO.getMemberCount(group.getId());
            gridPanel.add(buildGroupCard(group, members));
        }

        gridPanel.add(buildCreateCard());
        gridPanel.revalidate();
        gridPanel.repaint();
    }

    private JPanel buildGroupCard(Group group, int memberCount) {
        JPanel card = new JPanel(new BorderLayout());
        card.setPreferredSize(new Dimension(320, 150));
        card.setBackground(Color.WHITE);
        card.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(220, 220, 220)),
                new EmptyBorder(16, 16, 16, 16)));

        String initials = group.getName().length() >= 2
                ? group.getName().substring(0, 2).toUpperCase()
                : group.getName().substring(0, 1).toUpperCase();

        JPanel avatar = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(new Color(0, 102, 204));
                g2.fillOval(0, 0, getWidth(), getHeight());
                g2.setColor(Color.WHITE);
                g2.setFont(new Font("Segoe UI", Font.BOLD, 14));
                FontMetrics fm = g2.getFontMetrics();
                g2.drawString(initials, (getWidth() - fm.stringWidth(initials)) / 2,
                        (getHeight() + fm.getAscent() - fm.getDescent()) / 2);
                g2.dispose();
            }
        };
        avatar.setPreferredSize(new Dimension(44, 44));
        avatar.setOpaque(false);

        JLabel nameLbl = new JLabel(group.getName());
        nameLbl.setFont(new Font("Segoe UI", Font.BOLD, 15));
        JLabel membersLbl = new JLabel(memberCount + (memberCount == 1 ? " member" : " members"));
        membersLbl.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        membersLbl.setForeground(Color.GRAY);

        JPanel info = new JPanel(new GridLayout(2, 1));
        info.setOpaque(false);
        info.add(nameLbl);
        info.add(membersLbl);

        JPanel top = new JPanel(new BorderLayout(12, 0));
        top.setOpaque(false);
        top.add(avatar, BorderLayout.WEST);
        top.add(info, BorderLayout.CENTER);

        JButton manageBtn = UiStyles.outlineButton("Manage", () -> showManageGroupDialog(group));
        manageBtn.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        JButton deleteBtn = UiStyles.outlineButton("Delete", () -> deleteGroup(group));
        deleteBtn.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        
        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 4, 0));
        btnPanel.setOpaque(false);
        btnPanel.add(manageBtn);
        btnPanel.add(deleteBtn);
        top.add(btnPanel, BorderLayout.EAST);

        card.add(top, BorderLayout.NORTH);
        card.add(Box.createVerticalStrut(12), BorderLayout.CENTER);

        JLabel badge = new JLabel("ACTIVE", SwingConstants.CENTER);
        badge.setFont(new Font("Segoe UI", Font.BOLD, 10));
        badge.setForeground(new Color(0, 102, 204));
        badge.setOpaque(true);
        badge.setBackground(new Color(235, 245, 255));
        badge.setBorder(new EmptyBorder(4, 10, 4, 10));
        JPanel badgeRow = new JPanel(new FlowLayout(FlowLayout.LEFT, 0, 0));
        badgeRow.setOpaque(false);
        badgeRow.add(badge);
        card.add(badgeRow, BorderLayout.SOUTH);

        return card;
    }

    private JPanel buildCreateCard() {
        JPanel card = new JPanel(new GridBagLayout());
        card.setPreferredSize(new Dimension(320, 150));
        card.setBackground(new Color(250, 251, 252));
        card.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        card.setBorder(BorderFactory.createDashedBorder(new Color(180, 185, 195), 1, 5, 5, false));

        JLabel lbl = new JLabel("<html><center><span style='font-size:28px'>+</span><br>Create New Group</center></html>");
        lbl.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        lbl.setForeground(new Color(100, 110, 125));
        card.add(lbl);

        card.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override
            public void mouseClicked(java.awt.event.MouseEvent e) {
                showCreateGroupDialog();
            }
        });
        return card;
    }

    private void showCreateGroupDialog() {
        User user = Session.getCurrentUser();
        if (user == null) {
            JOptionPane.showMessageDialog(this, "Please log in first.", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        String name = JOptionPane.showInputDialog(this, "Enter group name:", "Create New Group", JOptionPane.PLAIN_MESSAGE);
        if (name == null) return;
        if (InputValidator.isNullOrEmpty(name)) {
            JOptionPane.showMessageDialog(this, "Group name cannot be empty.", "Validation Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        if (groupDAO.createGroup(new Group(name.trim(), user.getId()))) {
            JOptionPane.showMessageDialog(this, "Group created successfully! Add members next.", "Success", JOptionPane.INFORMATION_MESSAGE);
            refreshGroups();
        } else {
            JOptionPane.showMessageDialog(this, "Failed to create group. Check database connection.", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void showManageGroupDialog(Group group) {
        JDialog dialog = new JDialog(this, "Manage Group: " + group.getName(), true);
        dialog.setSize(500, 400);
        dialog.setLocationRelativeTo(this);

        JPanel main = new JPanel(new BorderLayout(10, 10));
        main.setBorder(new EmptyBorder(16, 16, 16, 16));

        // Title
        JLabel title = new JLabel("Members of " + group.getName());
        title.setFont(new Font("Segoe UI", Font.BOLD, 16));
        main.add(title, BorderLayout.NORTH);

        // Members list
        JPanel membersPanel = new JPanel(new BorderLayout());
        JTextArea membersArea = new JTextArea();
        membersArea.setEditable(false);
        membersArea.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        membersArea.setText(getMembersText(group.getId()));

        JScrollPane scroll = new JScrollPane(membersArea);
        membersPanel.add(scroll, BorderLayout.CENTER);

        // Add member section
        JPanel addPanel = new JPanel(new BorderLayout(8, 0));
        JTextField emailField = new JTextField();
        emailField.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        JButton addBtn = new JButton("Add Member");
        addBtn.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        addBtn.addActionListener(e -> {
            String email = emailField.getText().trim();
            if (InputValidator.isNullOrEmpty(email)) {
                JOptionPane.showMessageDialog(dialog, "Enter member email.", "Validation Error", JOptionPane.ERROR_MESSAGE);
                return;
            }
            addMemberByEmail(group.getId(), email, dialog, membersArea);
            emailField.setText("");
        });
        addPanel.add(new JLabel("Email:"), BorderLayout.WEST);
        addPanel.add(emailField, BorderLayout.CENTER);
        addPanel.add(addBtn, BorderLayout.EAST);

        // Buttons
        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        JButton closeBtn = new JButton("Close");
        closeBtn.addActionListener(e -> dialog.dispose());
        btnPanel.add(closeBtn);

        main.add(membersPanel, BorderLayout.CENTER);
        main.add(addPanel, BorderLayout.SOUTH);
        dialog.add(main, BorderLayout.CENTER);
        dialog.add(btnPanel, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }

    private String getMembersText(int groupId) {
        List<com.expensesplitter.models.User> members = groupDAO.getGroupMembers(groupId);
        if (members.isEmpty()) {
            return "No members yet.";
        }
        StringBuilder sb = new StringBuilder();
        for (com.expensesplitter.models.User m : members) {
            sb.append("✓ ").append(m.getName()).append(" (").append(m.getEmail()).append(")\n");
        }
        return sb.toString();
    }

    private void addMemberByEmail(int groupId, String email, JDialog dialog, JTextArea membersArea) {
        com.expensesplitter.dao.UserDAO userDAO = new com.expensesplitter.dao.UserDAO();
        com.expensesplitter.models.User user = userDAO.getUserByEmail(email);

        if (user == null) {
            JOptionPane.showMessageDialog(dialog, "User with email '" + email + "' not found.", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        if (groupDAO.addMember(groupId, user.getId())) {
            JOptionPane.showMessageDialog(dialog, "Member added successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
            membersArea.setText(getMembersText(groupId));
            refreshGroups();
        } else {
            JOptionPane.showMessageDialog(dialog, "Member already in group or error adding member.", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void deleteGroup(Group group) {
        int choice = JOptionPane.showConfirmDialog(this,
                "Delete group \"" + group.getName() + "\" and all its expenses?",
                "Confirm Delete", JOptionPane.YES_NO_OPTION, JOptionPane.WARNING_MESSAGE);
        if (choice != JOptionPane.YES_OPTION) return;

        if (groupDAO.deleteGroup(group.getId())) {
            JOptionPane.showMessageDialog(this, "Group deleted.", "Success", JOptionPane.INFORMATION_MESSAGE);
            refreshGroups();
        } else {
            JOptionPane.showMessageDialog(this, "Failed to delete group.", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }
}
