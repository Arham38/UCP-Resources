package com.expensesplitter.ui;

import com.expensesplitter.Session;
import com.expensesplitter.dao.ExpenseDAO;
import com.expensesplitter.dao.GroupDAO;
import com.expensesplitter.dao.UserDAO;
import com.expensesplitter.models.Category;
import com.expensesplitter.models.Expense;
import com.expensesplitter.models.Group;
import com.expensesplitter.models.User;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

public class LedgerDetailsFrame extends JFrame {

    private JTable ledgerTable;
    private DefaultTableModel tableModel;
    private JComboBox<String> groupCombo;
    private JTextField startDateField;
    private JTextField endDateField;
    private JComboBox<String> categoryCombo;
    private JComboBox<String> rowsPerPageCombo;
    private JLabel pageLabel;
    private int currentPage = 1;
    private int rowsPerPage = 6;
    private List<Expense> filteredExpenses = new ArrayList<>();

    public LedgerDetailsFrame() {
        setTitle("Expense Splitter - Ledger Details");
        setSize(1280, 800);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        JPanel root = new JPanel(new BorderLayout());
        root.setBackground(new Color(248, 249, 250));

        root.add(AppSidebar.create(this, AppSidebar.Page.EXPENSES), BorderLayout.WEST);

        JPanel center = new JPanel(new BorderLayout());
        center.setOpaque(false);
        center.add(AppSidebar.createTopBar(this), BorderLayout.NORTH);
        center.add(createMainContent(), BorderLayout.CENTER);

        root.add(center, BorderLayout.CENTER);
        add(root);

        loadExpenses();
    }

    private JPanel createMainContent() {
        JPanel main = new JPanel(new BorderLayout());
        main.setOpaque(false);
        main.setBorder(new EmptyBorder(24, 24, 24, 24));

        // Title section
        JPanel titleBlock = new JPanel();
        titleBlock.setLayout(new BoxLayout(titleBlock, BoxLayout.Y_AXIS));
        titleBlock.setOpaque(false);
        titleBlock.setBorder(new EmptyBorder(0, 0, 20, 0));

        JLabel title = new JLabel("Ledger Details");
        title.setFont(new Font("Segoe UI", Font.BOLD, 24));
        title.setForeground(new Color(30, 41, 59));

        JLabel subtitle = new JLabel("Manage and track all recorded expenses across your active groups.");
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        subtitle.setForeground(new Color(100, 116, 139));

        titleBlock.add(title);
        titleBlock.add(Box.createVerticalStrut(4));
        titleBlock.add(subtitle);

        // Filter section
        JPanel filterPanel = createFilterPanel();
        filterPanel.setBackground(Color.WHITE);
        filterPanel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(220, 220, 220)),
                new EmptyBorder(16, 16, 16, 16)));

        // Table section
        JPanel tablePanel = createTablePanel();
        tablePanel.setBackground(Color.WHITE);
        tablePanel.setBorder(BorderFactory.createLineBorder(new Color(220, 220, 220)));

        // Pagination section
        JPanel paginationPanel = createPaginationPanel();
        paginationPanel.setBackground(Color.WHITE);
        paginationPanel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(1, 0, 0, 0, new Color(220, 220, 220)),
                new EmptyBorder(12, 16, 12, 16)));

        // Combine table and pagination
        JPanel tableContainer = new JPanel(new BorderLayout());
        tableContainer.setOpaque(false);
        tableContainer.add(tablePanel, BorderLayout.CENTER);
        tableContainer.add(paginationPanel, BorderLayout.SOUTH);

        JPanel content = new JPanel(new BorderLayout());
        content.setOpaque(false);
        content.add(titleBlock, BorderLayout.NORTH);
        content.add(filterPanel, BorderLayout.CENTER);

        JPanel mainContent = new JPanel(new BorderLayout());
        mainContent.setOpaque(false);
        mainContent.add(content, BorderLayout.NORTH);
        mainContent.add(tableContainer, BorderLayout.CENTER);
        mainContent.setBorder(new EmptyBorder(0, 0, 16, 0));

        main.add(mainContent, BorderLayout.CENTER);
        return main;
    }

    private JPanel createFilterPanel() {
        JPanel filter = new JPanel(new BorderLayout());
        filter.setOpaque(false);

        // First row: Group, Date Range, Category
        JPanel firstRow = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 8));
        firstRow.setOpaque(false);

        // Group/Workspace dropdown
        JLabel groupLabel = new JLabel("Group / Workspace:");
        groupLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        groupLabel.setForeground(new Color(60, 70, 85));

        groupCombo = new JComboBox<>();
        groupCombo.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        groupCombo.setPreferredSize(new Dimension(180, 32));
        groupCombo.addItem("All Groups");
        User user = Session.getCurrentUser();
        if (user != null) {
            List<Group> groups = new GroupDAO().getGroupsByUser(user.getId());
            for (Group g : groups) {
                groupCombo.addItem(g.getName());
            }
        }

        // Date Range
        JLabel dateLabel = new JLabel("Date Range:");
        dateLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        dateLabel.setForeground(new Color(60, 70, 85));

        startDateField = new JTextField("YYYY-MM-DD");
        startDateField.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        startDateField.setPreferredSize(new Dimension(120, 32));
        startDateField.setBorder(BorderFactory.createLineBorder(new Color(210, 215, 225)));

        JLabel toLabel = new JLabel("to");
        toLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        toLabel.setForeground(new Color(100, 116, 139));

        endDateField = new JTextField("YYYY-MM-DD");
        endDateField.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        endDateField.setPreferredSize(new Dimension(120, 32));
        endDateField.setBorder(BorderFactory.createLineBorder(new Color(210, 215, 225)));

        // Category dropdown
        JLabel categoryLabel = new JLabel("Category:");
        categoryLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        categoryLabel.setForeground(new Color(60, 70, 85));

        categoryCombo = new JComboBox<>();
        categoryCombo.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        categoryCombo.setPreferredSize(new Dimension(140, 32));
        categoryCombo.addItem("All Categories");
        for (String cat : Category.ALL_NAMES) {
            categoryCombo.addItem(cat);
        }

        firstRow.add(groupLabel);
        firstRow.add(groupCombo);
        firstRow.add(dateLabel);
        firstRow.add(startDateField);
        firstRow.add(toLabel);
        firstRow.add(endDateField);
        firstRow.add(categoryLabel);
        firstRow.add(categoryCombo);

        // Second row: Buttons
        JPanel secondRow = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 8));
        secondRow.setOpaque(false);

        // Clear button
        JButton clearBtn = UiStyles.outlineButton("Clear", () -> {
            groupCombo.setSelectedIndex(0);
            startDateField.setText("YYYY-MM-DD");
            endDateField.setText("YYYY-MM-DD");
            categoryCombo.setSelectedIndex(0);
            loadExpenses();
        });

        // Apply Filters button
        JButton applyBtn = UiStyles.primaryButton("Apply Filters", () -> loadExpenses());

        secondRow.add(clearBtn);
        secondRow.add(applyBtn);

        filter.add(firstRow, BorderLayout.NORTH);
        filter.add(secondRow, BorderLayout.SOUTH);

        return filter;
    }

    private JPanel createTablePanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setOpaque(false);
        panel.setBorder(new EmptyBorder(0, 0, 0, 0));

        String[] columnNames = {"Date", "Description", "Category", "Amount", "Payer", "Participants", "Status"};
        tableModel = new DefaultTableModel(columnNames, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        ledgerTable = new JTable(tableModel);
        ledgerTable.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        ledgerTable.setRowHeight(44);
        ledgerTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        ledgerTable.getTableHeader().setFont(new Font("Segoe UI", Font.BOLD, 12));
        ledgerTable.getTableHeader().setBackground(new Color(248, 249, 250));
        ledgerTable.getTableHeader().setForeground(new Color(60, 70, 85));
        ledgerTable.getTableHeader().setBorder(BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(220, 220, 220)));

        // Custom renderer for status column
        ledgerTable.getColumnModel().getColumn(6).setCellRenderer(new DefaultTableCellRenderer() {
            @Override
            public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
                Component c = super.getTableCellRendererComponent(table, value, isSelected, hasFocus, row, column);
                if (c instanceof JLabel) {
                    JLabel label = (JLabel) c;
                    label.setHorizontalAlignment(SwingConstants.CENTER);
                    String status = (String) value;
                    if (status.equals("SETTLED")) {
                        label.setForeground(new Color(34, 197, 94));
                        label.setFont(new Font("Segoe UI", Font.BOLD, 11));
                    } else if (status.equals("PARTIAL")) {
                        label.setForeground(new Color(234, 179, 8));
                        label.setFont(new Font("Segoe UI", Font.BOLD, 11));
                    } else {
                        label.setForeground(new Color(239, 68, 68));
                        label.setFont(new Font("Segoe UI", Font.BOLD, 11));
                    }
                }
                return c;
            }
        });

        // Center align amount column
        ledgerTable.getColumnModel().getColumn(3).setCellRenderer(new DefaultTableCellRenderer() {
            @Override
            public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
                Component c = super.getTableCellRendererComponent(table, value, isSelected, hasFocus, row, column);
                if (c instanceof JLabel) {
                    ((JLabel) c).setHorizontalAlignment(SwingConstants.RIGHT);
                }
                return c;
            }
        });

        JScrollPane scrollPane = new JScrollPane(ledgerTable);
        scrollPane.setBorder(null);
        scrollPane.getViewport().setBackground(Color.WHITE);

        panel.add(scrollPane, BorderLayout.CENTER);
        return panel;
    }

    private JPanel createPaginationPanel() {
        JPanel pagination = new JPanel(new BorderLayout());
        pagination.setOpaque(false);

        // Left: Rows per page
        JPanel leftPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 0));
        leftPanel.setOpaque(false);

        JLabel rowsLabel = new JLabel("Rows per page:");
        rowsLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        rowsLabel.setForeground(new Color(60, 70, 85));

        rowsPerPageCombo = new JComboBox<>(new String[]{"6", "10", "20", "50"});
        rowsPerPageCombo.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        rowsPerPageCombo.setSelectedItem("6");
        rowsPerPageCombo.addActionListener(e -> {
            rowsPerPage = Integer.parseInt((String) rowsPerPageCombo.getSelectedItem());
            currentPage = 1;
            updateTable();
        });

        leftPanel.add(rowsLabel);
        leftPanel.add(rowsPerPageCombo);

        // Center: Page numbers
        JPanel centerPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 8, 0));
        centerPanel.setOpaque(false);

        pageLabel = new JLabel("1-6 of 142");
        pageLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        pageLabel.setForeground(new Color(60, 70, 85));

        JButton prevBtn = new JButton("◀");
        prevBtn.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        prevBtn.setPreferredSize(new Dimension(32, 28));
        prevBtn.setFocusPainted(false);
        prevBtn.setBorder(BorderFactory.createLineBorder(new Color(210, 215, 225)));
        prevBtn.setBackground(Color.WHITE);
        prevBtn.addActionListener(e -> {
            if (currentPage > 1) {
                currentPage--;
                updateTable();
            }
        });

        JButton nextBtn = new JButton("▶");
        nextBtn.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        nextBtn.setPreferredSize(new Dimension(32, 28));
        nextBtn.setFocusPainted(false);
        nextBtn.setBorder(BorderFactory.createLineBorder(new Color(210, 215, 225)));
        nextBtn.setBackground(Color.WHITE);
        nextBtn.addActionListener(e -> {
            int totalPages = (int) Math.ceil((double) filteredExpenses.size() / rowsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                updateTable();
            }
        });

        centerPanel.add(prevBtn);
        centerPanel.add(pageLabel);
        centerPanel.add(nextBtn);

        pagination.add(leftPanel, BorderLayout.WEST);
        pagination.add(centerPanel, BorderLayout.CENTER);

        return pagination;
    }

    private List<Group> userGroups = new ArrayList<>();

    private void loadExpenses() {
        User user = Session.getCurrentUser();
        if (user == null) {
            filteredExpenses.clear();
            updateTable();
            return;
        }

        userGroups = new GroupDAO().getGroupsByUser(user.getId());
        filteredExpenses = new ArrayList<>();

        for (Group group : userGroups) {
            List<Expense> expenses = new ExpenseDAO().getExpensesByGroup(group.getId());
            filteredExpenses.addAll(expenses);
        }

        // Apply filters
        applyFilters();
        updateTable();
    }

    private void applyFilters() {
        String selectedGroup = (String) groupCombo.getSelectedItem();
        String selectedCategory = (String) categoryCombo.getSelectedItem();
        String startDateStr = startDateField.getText().trim();
        String endDateStr = endDateField.getText().trim();

        List<Expense> temp = new ArrayList<>(filteredExpenses);
        filteredExpenses.clear();

        for (Expense expense : temp) {
            // Filter by group
            if (selectedGroup != null && !selectedGroup.equals("All Groups")) {
                Group expenseGroup = null;
                for (Group g : userGroups) {
                    if (g.getId() == expense.getGroupId()) {
                        expenseGroup = g;
                        break;
                    }
                }
                if (expenseGroup == null || !expenseGroup.getName().equals(selectedGroup)) {
                    continue;
                }
            }

            // Filter by category
            if (selectedCategory != null && !selectedCategory.equals("All Categories")) {
                String categoryName = getCategoryName(expense.getCategoryId());
                if (!categoryName.equals(selectedCategory)) {
                    continue;
                }
            }

            // Filter by date range
            if (!startDateStr.equals("YYYY-MM-DD") && !startDateStr.isEmpty()) {
                try {
                    java.time.LocalDate startDate = java.time.LocalDate.parse(startDateStr);
                    java.time.LocalDate expenseDate = expense.getDate().toLocalDate();
                    if (expenseDate.isBefore(startDate)) {
                        continue;
                    }
                } catch (Exception e) {
                    // Invalid date format, skip filter
                }
            }

            if (!endDateStr.equals("YYYY-MM-DD") && !endDateStr.isEmpty()) {
                try {
                    java.time.LocalDate endDate = java.time.LocalDate.parse(endDateStr);
                    java.time.LocalDate expenseDate = expense.getDate().toLocalDate();
                    if (expenseDate.isAfter(endDate)) {
                        continue;
                    }
                } catch (Exception e) {
                    // Invalid date format, skip filter
                }
            }

            filteredExpenses.add(expense);
        }
    }

    private String getCategoryName(int categoryId) {
        if (categoryId >= 0 && categoryId < Category.ALL_NAMES.length) {
            return Category.ALL_NAMES[categoryId];
        }
        return "Other";
    }

    private void updateTable() {
        tableModel.setRowCount(0);

        int startIndex = (currentPage - 1) * rowsPerPage;
        int endIndex = Math.min(startIndex + rowsPerPage, filteredExpenses.size());

        UserDAO userDAO = new UserDAO();
        GroupDAO groupDAO = new GroupDAO();
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMM dd, yyyy");

        for (int i = startIndex; i < endIndex; i++) {
            Expense expense = filteredExpenses.get(i);
            User payer = userDAO.getUserById(expense.getPaidBy());
            
            // Find group from userGroups
            Group group = null;
            for (Group g : userGroups) {
                if (g.getId() == expense.getGroupId()) {
                    group = g;
                    break;
                }
            }
            
            List<User> members = groupDAO.getGroupMembers(expense.getGroupId());

            String dateStr = expense.getDate() != null ? dateFormat.format(expense.getDate()) : "N/A";
            String payerName = payer != null ? payer.getName() : "Unknown";
            String categoryName = getCategoryName(expense.getCategoryId());
            String amountStr = String.format("Rs. %.2f", expense.getAmount());
            
            // Build participants string
            StringBuilder participants = new StringBuilder();
            for (int j = 0; j < members.size() && j < 3; j++) {
                if (j > 0) participants.append(", ");
                participants.append(members.get(j).getName());
            }
            if (members.size() > 3) {
                participants.append(" +").append(members.size() - 3);
            }

            // Determine status (simplified logic)
            String status = "UNSETTLED";
            // In a real implementation, you would check settlements to determine actual status

            Object[] row = {dateStr, expense.getDescription(), categoryName, amountStr, payerName, participants.toString(), status};
            tableModel.addRow(row);
        }

        // Update pagination label
        int totalExpenses = filteredExpenses.size();
        int start = totalExpenses == 0 ? 0 : startIndex + 1;
        int end = endIndex;
        pageLabel.setText(start + "-" + end + " of " + totalExpenses);
    }

    public static void main(String[] args) {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            e.printStackTrace();
        }
        SwingUtilities.invokeLater(() -> new LedgerDetailsFrame().setVisible(true));
    }
}
