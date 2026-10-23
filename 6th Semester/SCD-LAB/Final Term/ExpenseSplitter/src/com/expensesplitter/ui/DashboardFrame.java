// FIXED: Shared sidebar, DB-loaded groups, full navigation wiring
package com.expensesplitter.ui;

import com.expensesplitter.Session;
import com.expensesplitter.dao.ExpenseDAO;
import com.expensesplitter.dao.GroupDAO;
import com.expensesplitter.dao.SettlementDAO;
import com.expensesplitter.models.Expense;
import com.expensesplitter.models.Group;
import com.expensesplitter.models.Settlement;
import com.expensesplitter.models.User;

import javax.swing.*;
import javax.swing.border.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.ArrayList;
import java.util.List;

public class DashboardFrame extends JFrame {

    public DashboardFrame() {
        setTitle("Expense Splitter - Dashboard");
        setSize(1280, 800);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        JPanel root = new JPanel(new BorderLayout());
        root.setBackground(new Color(248, 249, 250));

        root.add(AppSidebar.create(this, AppSidebar.Page.DASHBOARD), BorderLayout.WEST);

        JPanel center = new JPanel(new BorderLayout());
        center.setOpaque(false);
        center.add(AppSidebar.createTopBar(this), BorderLayout.NORTH);
        center.add(createMainContent(), BorderLayout.CENTER);

        root.add(center, BorderLayout.CENTER);
        add(root);
    }

    private JPanel createMainContent() {
        JPanel main = new JPanel(new BorderLayout());
        main.setOpaque(false);
        main.setBorder(new EmptyBorder(22, 24, 22, 24));

        // Title
        JPanel titleBlock = new JPanel();
        titleBlock.setLayout(new BoxLayout(titleBlock, BoxLayout.Y_AXIS));
        titleBlock.setOpaque(false);
        titleBlock.setBorder(new EmptyBorder(0, 0, 16, 0));
        JLabel title = new JLabel("Overview");
        title.setFont(new Font("Segoe UI", Font.BOLD, 24));
        JLabel sub = new JLabel("Your financial snapshot across all active groups.");
        sub.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        sub.setForeground(Color.GRAY);
        titleBlock.add(title);
        titleBlock.add(Box.createVerticalStrut(3));
        titleBlock.add(sub);

        // Calculate totals from all groups
        double totalOwes = 0, totalOwedTo = 0;
        User user = Session.getCurrentUser();
        if (user != null) {
            List<Group> groups = new GroupDAO().getGroupsByUser(user.getId());
            for (Group g : groups) {
                double balance = calculateGroupBalance(g.getId(), user.getId());
                if (balance > 0) {
                    totalOwedTo += balance;
                } else {
                    totalOwes += Math.abs(balance);
                }
            }
        }

        // Metric cards row
        JPanel metrics = new JPanel(new GridLayout(1, 3, 16, 0));
        metrics.setOpaque(false);
        metrics.setBorder(new EmptyBorder(0, 0, 18, 0));
        metrics.add(metricCard("TOTAL YOU OWE",       "Rs. " + String.format("%.0f", totalOwes), new Color(220, 38, 38),   "↑", false));
        metrics.add(metricCard("TOTAL OWED TO YOU",   "Rs. " + String.format("%.0f", totalOwedTo), new Color(37, 99, 235), "↓", false));
        double netBalance = totalOwedTo - totalOwes;
        metrics.add(metricCard("OVERALL NET BALANCE", (netBalance >= 0 ? "+ " : "") + "Rs. " + String.format("%.0f", netBalance), new Color(15, 23, 42),  "🏦", true));

        JPanel top = new JPanel(new BorderLayout());
        top.setOpaque(false);
        top.add(titleBlock, BorderLayout.NORTH);
        top.add(metrics, BorderLayout.CENTER);

        // Bottom: Group Summary + Recent Activity side by side
        JPanel bottom = new JPanel(new BorderLayout(16, 0));
        bottom.setOpaque(false);
        bottom.add(createGroupSummaryPanel(), BorderLayout.CENTER);
        bottom.add(createRecentActivityPanel(), BorderLayout.EAST);

        main.add(top, BorderLayout.NORTH);
        main.add(bottom, BorderLayout.CENTER);
        return main;
    }

    // ── GROUP SUMMARY PANEL ────────────────────────────────────────
    private JPanel createGroupSummaryPanel() {
        JPanel outer = new JPanel(new BorderLayout());
        outer.setBackground(Color.WHITE);
        outer.setBorder(BorderFactory.createLineBorder(new Color(220, 220, 220)));

        JPanel header = new JPanel(new BorderLayout());
        header.setBackground(Color.WHITE);
        header.setBorder(new EmptyBorder(14, 16, 10, 16));

        JLabel hTitle = new JLabel("Group Summary");
        hTitle.setFont(new Font("Segoe UI", Font.BOLD, 14));

        JLabel viewAll = new JLabel("View All");
        viewAll.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        viewAll.setForeground(new Color(0, 102, 204));
        viewAll.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        viewAll.addMouseListener(new MouseAdapter() {
            @Override public void mouseClicked(MouseEvent e) {
                FrameNavigation.open(DashboardFrame.this, new GroupFrame());
            }
        });

        header.add(hTitle, BorderLayout.WEST);
        header.add(viewAll, BorderLayout.EAST);

        JPanel cards = new JPanel(new FlowLayout(FlowLayout.LEFT, 14, 14));
        cards.setBackground(Color.WHITE);

        User user = Session.getCurrentUser();
        if (user != null) {
            List<Group> groups = new GroupDAO().getGroupsByUser(user.getId());
            if (groups.isEmpty()) {
                JLabel empty = new JLabel("No groups yet — create one to get started.");
                empty.setFont(new Font("Segoe UI", Font.PLAIN, 13));
                empty.setForeground(Color.GRAY);
                empty.setBorder(new EmptyBorder(20, 16, 20, 16));
                cards.add(empty);
            } else {
                GroupDAO gdao = new GroupDAO();
                for (Group g : groups) {
                    int count = gdao.getMemberCount(g.getId());
                    double balance = calculateGroupBalance(g.getId(), user.getId());
                    int settledPct = calculateSettlementPercentage(g.getId());
                    Color amountColor = balance >= 0 ? new Color(0, 102, 204) : new Color(200, 0, 0);
                    String amountStr = (balance >= 0 ? "+" : "") + "Rs. " + String.format("%.0f", Math.abs(balance));
                    cards.add(groupCard(g.getName(), count + " Members", amountStr, amountColor, settledPct));
                }
            }
        }

        JButton newGroupBtn = createNewGroupCard();
        newGroupBtn.addActionListener(e -> FrameNavigation.open(this, new GroupFrame()));
        cards.add(newGroupBtn);

        outer.add(header, BorderLayout.NORTH);
        outer.add(cards, BorderLayout.CENTER);
        return outer;
    }

    // ── 5. RECENT ACTIVITY PANEL ──────────────────────────────────────
    private JPanel createRecentActivityPanel() {
        JPanel outer = new JPanel(new BorderLayout());
        outer.setPreferredSize(new Dimension(240, 0));
        outer.setBackground(Color.WHITE);
        outer.setBorder(BorderFactory.createLineBorder(new Color(220, 220, 220)));

        JPanel header = new JPanel(new FlowLayout(FlowLayout.LEFT, 6, 0));
        header.setBackground(Color.WHITE);
        header.setBorder(new EmptyBorder(14, 14, 10, 14));
        JLabel rIcon = new JLabel("⏲️");
        rIcon.setFont(new Font("Segoe UI Emoji", Font.PLAIN, 13));
        JLabel rTitle = new JLabel("Recent Activity");
        rTitle.setFont(new Font("Segoe UI", Font.BOLD, 14));
        header.add(rIcon); header.add(rTitle);

        JPanel items = new JPanel();
        items.setLayout(new BoxLayout(items, BoxLayout.Y_AXIS));
        items.setBackground(Color.WHITE);

        User user = Session.getCurrentUser();
        if (user != null) {
            List<ActivityEvent> allEvents = getRecentActivities(user.getId());
            
            if (allEvents.isEmpty()) {
                items.add(activityItem("—", "No recent activity yet.", null, ""));
            } else {
                int limit = Math.min(4, allEvents.size());
                for (int i = 0; i < limit; i++) {
                    ActivityEvent event = allEvents.get(i);
                    items.add(activityItem(event.emoji, event.description, event.highlight, event.date));
                }
            }
        }

        JPanel footer = new JPanel(new FlowLayout(FlowLayout.CENTER));
        footer.setBackground(Color.WHITE);
        footer.setBorder(BorderFactory.createMatteBorder(1, 0, 0, 0, new Color(230, 230, 230)));
        JLabel viewHist = new JLabel("<html><a href=''>⊲ View Full History</a></html>");
        viewHist.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        footer.add(viewHist);

        outer.add(header, BorderLayout.NORTH);
        outer.add(new JScrollPane(items) {{
            setBorder(null);
            getViewport().setBackground(Color.WHITE);
        }}, BorderLayout.CENTER);
        outer.add(footer, BorderLayout.SOUTH);
        return outer;
    }

    // ── BALANCE & SETTLEMENT CALCULATIONS ──────────────────────────
    private double calculateGroupBalance(int groupId, int userId) {
        ExpenseDAO expenseDAO = new ExpenseDAO();
        List<Expense> expenses = expenseDAO.getExpensesByGroup(groupId);
        double totalPaidByUser = 0;
        double totalUserShare = 0;
        int memberCount = new GroupDAO().getMemberCount(groupId);

        for (Expense e : expenses) {
            if (e.getPaidBy() == userId) {
                totalPaidByUser += e.getAmount();
            }
            // User's share is calculated excluding the payer
            // If user paid, they owe 0 for this expense
            // If user didn't pay, they owe their share among (memberCount - 1) people
            if (e.getPaidBy() != userId) {
                int membersToDivide = memberCount - 1;
                if (membersToDivide > 0) {
                    totalUserShare += e.getAmount() / (double) membersToDivide;
                }
            }
        }
        return totalPaidByUser - totalUserShare;
    }

    private int calculateSettlementPercentage(int groupId) {
        ExpenseDAO expenseDAO = new ExpenseDAO();
        SettlementDAO settlementDAO = new SettlementDAO();
        List<Expense> expenses = expenseDAO.getExpensesByGroup(groupId);
        
        if (expenses.isEmpty()) return 100;
        
        double totalExpenses = expenses.stream().mapToDouble(Expense::getAmount).sum();
        List<Settlement> settlements = settlementDAO.getSettlementsByGroup(groupId);
        double totalSettled = settlements.stream().mapToDouble(Settlement::getAmount).sum();
        
        return totalSettled >= totalExpenses ? 100 : (int) ((totalSettled / totalExpenses) * 100);
    }

    private List<ActivityEvent> getRecentActivities(int userId) {
        List<ActivityEvent> events = new ArrayList<>();
        ExpenseDAO expenseDAO = new ExpenseDAO();
        SettlementDAO settlementDAO = new SettlementDAO();
        GroupDAO groupDAO = new GroupDAO();
        com.expensesplitter.dao.UserDAO userDAO = new com.expensesplitter.dao.UserDAO();
        
        // Collect expenses from user's groups
        List<Group> userGroups = groupDAO.getGroupsByUser(userId);
        for (Group g : userGroups) {
            List<Expense> expenses = expenseDAO.getExpensesByGroup(g.getId());
            for (Expense e : expenses) {
                User expenseUser = userDAO.getUserById(e.getPaidBy());
                String userName = expenseUser != null ? expenseUser.getName() : "Someone";
                String desc = userName + " added '" + e.getDescription() + "' in " + g.getName();
                events.add(new ActivityEvent("📝", desc, null, formatDate(e.getDate().toString())));
            }
            
            List<Settlement> settlements = settlementDAO.getSettlementsByGroup(g.getId());
            for (Settlement s : settlements) {
                User payer = userDAO.getUserById(s.getPayerId());
                User payee = userDAO.getUserById(s.getPayeeId());
                String payerName = payer != null ? payer.getName() : "Someone";
                String payeeName = payee != null ? payee.getName() : "Someone";
                String desc = payerName + " settled Rs. " + String.format("%.0f", s.getAmount()) + " to " + payeeName;
                events.add(new ActivityEvent("✓", desc, null, formatDate(s.getDate().toString())));
            }
        }
        
        // Sort by date (most recent first)
        events.sort((a, b) -> {
            try {
                return java.time.LocalDate.parse(b.date).compareTo(java.time.LocalDate.parse(a.date));
            } catch (Exception e) {
                return 0;
            }
        });
        
        return events;
    }

    private String formatDate(String dateStr) {
        try {
            java.time.LocalDate date = java.time.LocalDate.parse(dateStr);
            java.time.LocalDate today = java.time.LocalDate.now();
            long daysAgo = java.time.temporal.ChronoUnit.DAYS.between(date, today);
            
            if (daysAgo == 0) return "Today";
            if (daysAgo == 1) return "Yesterday";
            if (daysAgo < 7) return daysAgo + " days ago";
            if (daysAgo < 30) return (daysAgo / 7) + " weeks ago";
            return (daysAgo / 30) + " months ago";
        } catch (Exception e) {
            return dateStr;
        }
    }

    // ── ACTIVITY EVENT CLASS ──────────────────────────────────────
    private static class ActivityEvent {
        String emoji, description, highlight, date;
        
        ActivityEvent(String emoji, String description, String highlight, String date) {
            this.emoji = emoji;
            this.description = description;
            this.highlight = highlight;
            this.date = date;
        }
    }

    // ── COMPONENT FACTORIES ───────────────────────────────────────────

    private JPanel metricCard(String label, String value, Color valueColor, String icon, boolean rightBorder) {
        JPanel card = new JPanel(new BorderLayout());
        card.setBackground(Color.WHITE);
        card.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(1, 1, 1, 1, new Color(210, 215, 225)),
                new EmptyBorder(20, 20, 20, 20)));

        // Icon and label row
        JPanel topRow = new JPanel(new BorderLayout());
        topRow.setOpaque(false);
        
        JLabel iconLabel = new JLabel(icon);
        iconLabel.setFont(new Font("Segoe UI", Font.PLAIN, 20));
        
        JLabel lbl = new JLabel(label);
        lbl.setFont(new Font("Segoe UI", Font.BOLD, 11));
        lbl.setForeground(new Color(100, 110, 125));
        
        topRow.add(iconLabel, BorderLayout.WEST);
        topRow.add(lbl, BorderLayout.CENTER);

        JLabel val = new JLabel(value);
        val.setFont(new Font("Segoe UI", Font.BOLD, 28));
        val.setForeground(valueColor);
        val.setBorder(new EmptyBorder(12, 0, 0, 0));

        card.add(topRow, BorderLayout.NORTH);
        card.add(val, BorderLayout.CENTER);
        return card;
    }

    private JPanel groupCard(String name, String members, String balance, Color color, int pct) {
        JPanel card = new JPanel();
        card.setLayout(new BoxLayout(card, BoxLayout.Y_AXIS));
        card.setPreferredSize(new Dimension(220, 140));
        card.setBackground(Color.WHITE);
        card.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(220, 220, 220)),
                new EmptyBorder(16, 16, 16, 16)));

        // Group name
        JLabel nameLbl = new JLabel(name);
        nameLbl.setFont(new Font("Segoe UI", Font.BOLD, 14));
        nameLbl.setForeground(new Color(30, 41, 59));
        nameLbl.setAlignmentX(LEFT_ALIGNMENT);
        card.add(nameLbl);
        card.add(Box.createVerticalStrut(8));

        // Balance badge
        JLabel balanceLbl = new JLabel(balance);
        balanceLbl.setFont(new Font("Segoe UI", Font.BOLD, 13));
        balanceLbl.setForeground(color);
        balanceLbl.setAlignmentX(LEFT_ALIGNMENT);
        balanceLbl.setBorder(new EmptyBorder(4, 0, 4, 0));
        card.add(balanceLbl);

        // Members
        JLabel memLbl = new JLabel(members);
        memLbl.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        memLbl.setForeground(new Color(100, 116, 139));
        memLbl.setAlignmentX(LEFT_ALIGNMENT);
        card.add(memLbl);
        card.add(Box.createVerticalStrut(12));

        // Progress bar
        JProgressBar bar = new JProgressBar(0, 100);
        bar.setValue(pct);
        bar.setForeground(color);
        bar.setBackground(new Color(241, 245, 249));
        bar.setBorderPainted(false);
        bar.setMaximumSize(new Dimension(Integer.MAX_VALUE, 6));
        bar.setAlignmentX(LEFT_ALIGNMENT);
        card.add(bar);
        card.add(Box.createVerticalStrut(6));

        // Settled percentage
        JLabel settled = new JLabel("Settled " + pct + "%");
        settled.setFont(new Font("Segoe UI", Font.PLAIN, 10));
        settled.setForeground(new Color(100, 116, 139));
        settled.setAlignmentX(RIGHT_ALIGNMENT);
        card.add(settled);

        return card;
    }

    private JButton createNewGroupCard() {
        JButton btn = new JButton("<html><center><font size='5'>&#8853;</font><br>Create New Group</center></html>") {
            @Override protected void paintComponent(Graphics g) {
                g.setColor(new Color(250, 251, 252));
                g.fillRect(0, 0, getWidth(), getHeight());
                super.paintComponent(g);
            }
        };
        btn.setPreferredSize(new Dimension(200, 130));
        btn.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        btn.setForeground(new Color(100, 110, 125));
        btn.setContentAreaFilled(false);
        btn.setFocusPainted(false);
        btn.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        BasicStroke dashed = new BasicStroke(1.2f, BasicStroke.CAP_BUTT, BasicStroke.JOIN_BEVEL,
                0, new float[]{5}, 0);
        btn.setBorder(BorderFactory.createStrokeBorder(dashed, new Color(180, 185, 195)));
        return btn;
    }

    private JPanel activityItem(String emoji, String text, String highlight, String time) {
        JPanel row = new JPanel(new BorderLayout(12, 0));
        row.setBackground(Color.WHITE);
        row.setMaximumSize(new Dimension(Integer.MAX_VALUE, 60));
        row.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(235, 235, 235)),
                new EmptyBorder(12, 16, 12, 16)));

        // Circle avatar with emoji
        JLabel av = new JLabel() {
            @Override protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(new Color(241, 245, 249));
                g2.fillOval(0, 0, getWidth(), getHeight());
                g2.setFont(new Font("Segoe UI", Font.PLAIN, 14));
                FontMetrics fm = g2.getFontMetrics();
                g2.setColor(new Color(71, 85, 105));
                g2.drawString(emoji,
                        (getWidth()  - fm.stringWidth(emoji)) / 2,
                        (getHeight() + fm.getAscent() - fm.getDescent()) / 2);
                g2.dispose();
            }
        };
        av.setPreferredSize(new Dimension(36, 36));
        av.setMinimumSize(new Dimension(36, 36));

        // Text description
        String html = "<html><div style='width:160px'>" + text;
        if (highlight != null)
            html += " <font color='#2563eb'><b>" + highlight + "</b></font>";
        html += "</div></html>";
        JLabel desc = new JLabel(html);
        desc.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        desc.setForeground(new Color(30, 41, 59));

        JLabel timeLbl = new JLabel(time);
        timeLbl.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        timeLbl.setForeground(new Color(148, 163, 184));

        JPanel txt = new JPanel();
        txt.setLayout(new BoxLayout(txt, BoxLayout.Y_AXIS));
        txt.setOpaque(false);
        txt.add(desc);
        txt.add(Box.createVerticalStrut(4));
        txt.add(timeLbl);

        row.add(av,  BorderLayout.WEST);
        row.add(txt, BorderLayout.CENTER);
        return row;
    }

    public static void main(String[] args) {
        try { UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); }
        catch (Exception e) { e.printStackTrace(); }
        SwingUtilities.invokeLater(() -> new DashboardFrame().setVisible(true));
    }
}