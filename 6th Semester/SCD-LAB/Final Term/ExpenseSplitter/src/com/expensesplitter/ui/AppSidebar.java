// FIXED: Shared sidebar navigation for all main app frames
package com.expensesplitter.ui;

import com.expensesplitter.Session;
import com.expensesplitter.models.User;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;

public final class AppSidebar {

    public enum Page {
        DASHBOARD, GROUPS, EXPENSES, LEDGER_DETAILS, SETTLEMENTS, SEARCH_FILTER, SETTINGS
    }

    private AppSidebar() {}

    public static JPanel create(JFrame owner, Page active) {
        JPanel sidebar = new JPanel(new BorderLayout());
        sidebar.setPreferredSize(new Dimension(220, 0));
        sidebar.setBackground(Color.WHITE);
        sidebar.setBorder(BorderFactory.createMatteBorder(0, 0, 0, 1, new Color(220, 220, 220)));

        JPanel nav = new JPanel();
        nav.setLayout(new BoxLayout(nav, BoxLayout.Y_AXIS));
        nav.setOpaque(false);
        nav.add(Box.createVerticalStrut(16));

        JLabel logo = new JLabel("ExpenseSplitter");
        logo.setFont(new Font("Segoe UI", Font.BOLD, 18));
        logo.setForeground(new Color(0, 102, 204));
        logo.setAlignmentX(Component.LEFT_ALIGNMENT);
        logo.setBorder(new EmptyBorder(0, 20, 4, 0));
        nav.add(logo);

        JLabel sub = new JLabel("Enterprise Edition");
        sub.setFont(new Font("Segoe UI", Font.PLAIN, 10));
        sub.setForeground(Color.GRAY);
        sub.setAlignmentX(Component.LEFT_ALIGNMENT);
        sub.setBorder(new EmptyBorder(0, 20, 18, 0));
        nav.add(sub);

        nav.add(navBtn(owner, "Dashboard", active == Page.DASHBOARD, () -> {
            if (active != Page.DASHBOARD) FrameNavigation.open(owner, new DashboardFrame());
        }));
        nav.add(navBtn(owner, "Groups", active == Page.GROUPS, () -> {
            if (active != Page.GROUPS) FrameNavigation.open(owner, new GroupFrame());
        }));
        nav.add(navBtn(owner, "Expenses", active == Page.EXPENSES, () -> {
            if (active != Page.EXPENSES) FrameNavigation.open(owner, new ExpensesFrame());
        }));
        nav.add(navBtn(owner, "Ledger Details", active == Page.LEDGER_DETAILS, () -> {
            if (active != Page.LEDGER_DETAILS) FrameNavigation.open(owner, new LedgerDetailsFrame());
        }));
        nav.add(navBtn(owner, "Settlements", active == Page.SETTLEMENTS, () -> {
            if (active != Page.SETTLEMENTS) FrameNavigation.open(owner, new SettlementFrame());
        }));
        nav.add(navBtn(owner, "Search & Filter", active == Page.SEARCH_FILTER, () -> {
            JOptionPane.showMessageDialog(owner, "Search & Filter feature coming soon!", "Info", JOptionPane.INFORMATION_MESSAGE);
        }));
        nav.add(navBtn(owner, "Settings", active == Page.SETTINGS, () -> {
            JOptionPane.showMessageDialog(owner, "Settings feature coming soon!", "Info", JOptionPane.INFORMATION_MESSAGE);
        }));

        sidebar.add(nav, BorderLayout.CENTER);

        JPanel footer = new JPanel();
        footer.setLayout(new BoxLayout(footer, BoxLayout.Y_AXIS));
        footer.setOpaque(false);
        footer.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(1, 0, 0, 0, new Color(230, 230, 230)),
                new EmptyBorder(10, 0, 16, 0)));

        User user = Session.getCurrentUser();
        String profileLabel = user != null ? user.getName() : "Profile";
        footer.add(navBtn(owner, profileLabel, false, () ->
                JOptionPane.showMessageDialog(owner,
                        user != null ? "Logged in as " + user.getEmail() : "Not logged in",
                        "Profile", JOptionPane.INFORMATION_MESSAGE)));

        JButton logout = navBtn(owner, "Logout", false, () -> FrameNavigation.logout(owner));
        footer.add(logout);
        sidebar.add(footer, BorderLayout.SOUTH);

        return sidebar;
    }

    private static JButton navBtn(JFrame owner, String label, boolean active, Runnable action) {
        JButton btn = new JButton(label);
        btn.setAlignmentX(Component.LEFT_ALIGNMENT);
        btn.setMaximumSize(new Dimension(220, 44));
        btn.setHorizontalAlignment(SwingConstants.LEFT);
        btn.setFocusPainted(false);
        btn.setFont(new Font("Segoe UI", active ? Font.BOLD : Font.PLAIN, 14));
        btn.setForeground(active ? new Color(0, 102, 204) : new Color(60, 70, 85));
        btn.setBackground(active ? new Color(235, 245, 255) : Color.WHITE);
        btn.setContentAreaFilled(active);
        btn.setOpaque(active);
        btn.setBorder(new EmptyBorder(10, 20, 10, 20));
        btn.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        btn.addActionListener(e -> action.run());
        return btn;
    }

    /** Top navbar strip with tabs, search, notifications, and Add Expense button — used on all main frames. */
    public static JPanel createTopBar(JFrame owner) {
        JPanel bar = new JPanel(new BorderLayout());
        bar.setBackground(Color.WHITE);
        bar.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(220, 220, 220)),
                new EmptyBorder(12, 20, 12, 20)));

        // Left side: Navigation tabs
        JPanel leftPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 0));
        leftPanel.setOpaque(false);
        
        String[] tabs = {"ExpenseSplitter", "Recent", "Pinned", "Starred"};
        for (String tab : tabs) {
            JLabel tabLabel = new JLabel(tab);
            tabLabel.setFont(new Font("Segoe UI", Font.PLAIN, 13));
            tabLabel.setForeground(new Color(100, 110, 125));
            tabLabel.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
            tabLabel.setBorder(new EmptyBorder(8, 12, 8, 12));
            tabLabel.addMouseListener(new java.awt.event.MouseAdapter() {
                public void mouseEntered(java.awt.event.MouseEvent e) {
                    tabLabel.setForeground(new Color(0, 102, 204));
                }
                public void mouseExited(java.awt.event.MouseEvent e) {
                    tabLabel.setForeground(new Color(100, 110, 125));
                }
            });
            leftPanel.add(tabLabel);
        }

        // Center: Search bar
        JPanel searchPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 0, 0));
        searchPanel.setOpaque(false);
        
        JPanel searchBox = new JPanel(new BorderLayout());
        searchBox.setBackground(new Color(245, 246, 250));
        searchBox.setBorder(BorderFactory.createLineBorder(new Color(210, 215, 225)));
        searchBox.setPreferredSize(new Dimension(280, 36));
        
        JLabel searchIcon = new JLabel("🔍");
        searchIcon.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        searchIcon.setBorder(new EmptyBorder(0, 10, 0, 10));
        
        JTextField searchField = new JTextField("Search...");
        searchField.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        searchField.setForeground(new Color(130, 140, 155));
        searchField.setBorder(null);
        searchField.setBackground(new Color(245, 246, 250));
        searchField.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyPressed(java.awt.event.KeyEvent e) {
                if (e.getKeyCode() == java.awt.event.KeyEvent.VK_ENTER) {
                    String query = searchField.getText().trim();
                    if (!query.isEmpty() && !query.equals("Search...")) {
                        showSearchResults(owner, query);
                    }
                }
            }
        });
        
        searchBox.add(searchIcon, BorderLayout.WEST);
        searchBox.add(searchField, BorderLayout.CENTER);
        searchPanel.add(searchBox);

        // Right side: Icons and buttons
        JPanel rightPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 12, 0));
        rightPanel.setOpaque(false);
        
        // Notification bell
        JLabel bell = new JLabel("🔔");
        bell.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        bell.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        bell.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent e) {
                showNotificationsDialog(owner);
            }
        });
        
        // Help icon
        JLabel help = new JLabel("❓");
        help.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        help.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        help.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent e) {
                JOptionPane.showMessageDialog(owner, "Help documentation coming soon!", "Help", JOptionPane.INFORMATION_MESSAGE);
            }
        });
        
        // Export icon
        JLabel export = new JLabel("📤");
        export.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        export.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        export.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent e) {
                showExportDialog(owner);
            }
        });
        
        // Add Expense button
        JButton addExpenseBtn = UiStyles.primaryButton("+ Add Expense", () ->
                new ExpenseDialog(owner).setVisible(true));
        
        // User profile
        User user = Session.getCurrentUser();
        String userInitial = user != null ? String.valueOf(user.getName().charAt(0)).toUpperCase() : "U";
        JLabel profile = new JLabel(userInitial);
        profile.setFont(new Font("Segoe UI", Font.BOLD, 14));
        profile.setForeground(Color.WHITE);
        profile.setBackground(new Color(0, 102, 204));
        profile.setOpaque(true);
        profile.setPreferredSize(new Dimension(36, 36));
        profile.setHorizontalAlignment(SwingConstants.CENTER);
        profile.setVerticalAlignment(SwingConstants.CENTER);
        profile.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        profile.setBorder(BorderFactory.createLineBorder(new Color(0, 82, 184)));
        profile.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent e) {
                JOptionPane.showMessageDialog(owner,
                        user != null ? "Logged in as " + user.getEmail() : "Not logged in",
                        "Profile", JOptionPane.INFORMATION_MESSAGE);
            }
        });
        
        rightPanel.add(bell);
        rightPanel.add(help);
        rightPanel.add(export);
        rightPanel.add(addExpenseBtn);
        rightPanel.add(profile);

        bar.add(leftPanel, BorderLayout.WEST);
        bar.add(searchPanel, BorderLayout.CENTER);
        bar.add(rightPanel, BorderLayout.EAST);
        return bar;
    }

    private static void showSearchResults(JFrame owner, String query) {
        JDialog dialog = new JDialog(owner, "Search Results", true);
        dialog.setSize(600, 400);
        dialog.setLocationRelativeTo(owner);
        
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(Color.WHITE);
        panel.setBorder(new EmptyBorder(20, 20, 20, 20));
        
        JLabel title = new JLabel("Search Results for: " + query);
        title.setFont(new Font("Segoe UI", Font.BOLD, 16));
        title.setBorder(new EmptyBorder(0, 0, 16, 0));
        
        JLabel results = new JLabel("<html><div style='padding: 20px; text-align: center;'>" +
                "Search functionality is under development.<br><br>" +
                "You searched for: <b>" + query + "</b><br><br>" +
                "This feature will allow you to search for:<br>" +
                "• Expenses by description<br>" +
                "• Groups by name<br>" +
                "• Settlements<br>" +
                "• Users</div></html>");
        results.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        results.setForeground(new Color(100, 110, 125));
        
        JButton closeBtn = new JButton("Close");
        closeBtn.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        closeBtn.addActionListener(e -> dialog.dispose());
        
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        buttonPanel.setOpaque(false);
        buttonPanel.add(closeBtn);
        
        panel.add(title, BorderLayout.NORTH);
        panel.add(results, BorderLayout.CENTER);
        panel.add(buttonPanel, BorderLayout.SOUTH);
        
        dialog.add(panel);
        dialog.setVisible(true);
    }

    private static void showNotificationsDialog(JFrame owner) {
        JDialog dialog = new JDialog(owner, "Notifications", true);
        dialog.setSize(500, 350);
        dialog.setLocationRelativeTo(owner);
        
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(Color.WHITE);
        panel.setBorder(new EmptyBorder(20, 20, 20, 20));
        
        JLabel title = new JLabel("Notifications");
        title.setFont(new Font("Segoe UI", Font.BOLD, 16));
        title.setBorder(new EmptyBorder(0, 0, 16, 0));
        
        JLabel content = new JLabel("<html><div style='padding: 20px; text-align: center;'>" +
                "🎉 No new notifications!<br><br>" +
                "You're all caught up. Here's what you'll see here:<br>" +
                "• New expense additions in your groups<br>" +
                "• Settlement confirmations<br>" +
                "• Group invitations<br>" +
                "• Balance updates</div></html>");
        content.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        content.setForeground(new Color(100, 110, 125));
        
        JButton closeBtn = new JButton("Close");
        closeBtn.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        closeBtn.addActionListener(e -> dialog.dispose());
        
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        buttonPanel.setOpaque(false);
        buttonPanel.add(closeBtn);
        
        panel.add(title, BorderLayout.NORTH);
        panel.add(content, BorderLayout.CENTER);
        panel.add(buttonPanel, BorderLayout.SOUTH);
        
        dialog.add(panel);
        dialog.setVisible(true);
    }

    private static void showExportDialog(JFrame owner) {
        JDialog dialog = new JDialog(owner, "Export Data", true);
        dialog.setSize(500, 380);
        dialog.setLocationRelativeTo(owner);
        
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBackground(Color.WHITE);
        panel.setBorder(new EmptyBorder(20, 20, 20, 20));
        
        JLabel title = new JLabel("Export Your Data");
        title.setFont(new Font("Segoe UI", Font.BOLD, 16));
        title.setBorder(new EmptyBorder(0, 0, 16, 0));
        
        JPanel options = new JPanel();
        options.setLayout(new BoxLayout(options, BoxLayout.Y_AXIS));
        options.setOpaque(false);
        
        JCheckBox expensesCheck = new JCheckBox("Export Expenses");
        expensesCheck.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        expensesCheck.setSelected(true);
        
        JCheckBox settlementsCheck = new JCheckBox("Export Settlements");
        settlementsCheck.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        settlementsCheck.setSelected(true);
        
        JCheckBox groupsCheck = new JCheckBox("Export Group Data");
        groupsCheck.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        groupsCheck.setSelected(false);
        
        options.add(expensesCheck);
        options.add(Box.createVerticalStrut(8));
        options.add(settlementsCheck);
        options.add(Box.createVerticalStrut(8));
        options.add(groupsCheck);
        
        JLabel formatLabel = new JLabel("Export Format:");
        formatLabel.setFont(new Font("Segoe UI", Font.BOLD, 12));
        formatLabel.setBorder(new EmptyBorder(12, 0, 8, 0));
        
        JComboBox<String> formatCombo = new JComboBox<>(new String[]{"CSV", "JSON", "PDF"});
        formatCombo.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        
        JPanel formatPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 0, 0));
        formatPanel.setOpaque(false);
        formatPanel.add(formatLabel);
        formatPanel.add(formatCombo);
        
        JButton exportBtn = new JButton("Export");
        exportBtn.setFont(new Font("Segoe UI", Font.BOLD, 12));
        exportBtn.setBackground(new Color(0, 102, 204));
        exportBtn.setForeground(Color.WHITE);
        exportBtn.addActionListener(e -> {
            JOptionPane.showMessageDialog(dialog, 
                    "Export functionality is under development.\n\n" +
                    "Selected options:\n" +
                    (expensesCheck.isSelected() ? "✓ Expenses\n" : "") +
                    (settlementsCheck.isSelected() ? "✓ Settlements\n" : "") +
                    (groupsCheck.isSelected() ? "✓ Group Data\n" : "") +
                    "Format: " + formatCombo.getSelectedItem(),
                    "Export", JOptionPane.INFORMATION_MESSAGE);
        });
        
        JButton cancelBtn = new JButton("Cancel");
        cancelBtn.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        cancelBtn.addActionListener(e -> dialog.dispose());
        
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 8, 0));
        buttonPanel.setOpaque(false);
        buttonPanel.add(cancelBtn);
        buttonPanel.add(exportBtn);
        
        JPanel contentPanel = new JPanel(new BorderLayout());
        contentPanel.setOpaque(false);
        contentPanel.add(options, BorderLayout.NORTH);
        contentPanel.add(formatPanel, BorderLayout.CENTER);
        
        panel.add(title, BorderLayout.NORTH);
        panel.add(contentPanel, BorderLayout.CENTER);
        panel.add(buttonPanel, BorderLayout.SOUTH);
        
        dialog.add(panel);
        dialog.setVisible(true);
    }
}
