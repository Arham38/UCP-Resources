// FIXED: Register button paint, Show/Hide toggle, accent colors aligned with LoginFrame
package com.expensesplitter.ui;

import com.expensesplitter.dao.UserDAO;
import com.expensesplitter.models.User;
import com.expensesplitter.validation.InputValidator;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import java.awt.*;
import java.awt.event.*;

public class RegisterFrame extends JFrame {

    private PlaceholderTextField txtName;
    private PlaceholderTextField txtEmail;
    private JPasswordField       txtPassword;
    private JPasswordField       txtConfirmPassword;
    private JButton              btnRegister;
    private JLabel               lblBackToLogin;

    private JLabel lblRuleLength;
    private JLabel lblRuleNumber;
    private JLabel lblRuleSpecial;

    // Card dimensions matching your target design specs
    private static final int CARD_W = 390;
    private static final int FIELD_W = CARD_W - 72;

    public RegisterFrame() {
        setTitle("Expense Splitter - Create Account");
        setSize(500, 780);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);
        getContentPane().setBackground(new Color(245, 247, 250));
        initComponents();
    }

    private void initComponents() {
        setLayout(new GridBagLayout());
        JPanel card = buildCard();

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0; gbc.gridy = 0;
        gbc.insets = new Insets(10, 0, 10, 0);
        add(card, gbc);
    }

    // ── CARD ──────────────────────────────────────────────────────────
    private JPanel buildCard() {
        JPanel card = new JPanel(new GridBagLayout());
        card.setBackground(Color.WHITE);
        card.setPreferredSize(new Dimension(CARD_W, 700));
        card.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(220, 224, 230), 1),
                new EmptyBorder(32, 36, 28, 36)));

        GridBagConstraints g = new GridBagConstraints();
        g.fill = GridBagConstraints.HORIZONTAL;
        g.gridx = 0;
        g.weightx = 1.0;
        int row = 0;

        // ── HEADER ────────────────────────────────────────────────────
        JPanel headerRow = centeredRow();
        headerRow.add(new JLabel(buildBankIcon()));
        headerRow.add(hgap(8));
        JLabel titleLbl = new JLabel("ExpenseSplitter");
        titleLbl.setFont(new Font("Segoe UI", Font.BOLD, 22));
        titleLbl.setForeground(new Color(0, 102, 204));
        headerRow.add(titleLbl);

        g.gridy = row++; g.insets = new Insets(0, 0, 0, 0);
        card.add(headerRow, g);

        JLabel subtitleLbl = new JLabel("Create your account", SwingConstants.CENTER);
        subtitleLbl.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        subtitleLbl.setForeground(new Color(110, 120, 135));

        g.gridy = row++; g.insets = new Insets(6, 0, 0, 0);
        card.add(subtitleLbl, g);

        g.gridy = row++; g.insets = new Insets(20, 0, 22, 0);
        card.add(hairline(), g);

        // ── FIELDS ────────────────────────────────────────────────────
        g.gridy = row++; g.insets = new Insets(0, 0, 0, 0);
        card.add(fieldLabel("Full Name"), g);

        txtName = new PlaceholderTextField("Jane Doe", FIELD_W);
        g.gridy = row++; g.insets = new Insets(5, 0, 14, 0);
        card.add(txtName, g);

        g.gridy = row++; g.insets = new Insets(0, 0, 0, 0);
        card.add(fieldLabel("Email Address"), g);

        txtEmail = new PlaceholderTextField("jane.doe@company.com", FIELD_W);
        g.gridy = row++; g.insets = new Insets(5, 0, 14, 0);
        card.add(txtEmail, g);

        g.gridy = row++; g.insets = new Insets(0, 0, 0, 0);
        card.add(fieldLabel("Password"), g);

        g.gridy = row++; g.insets = new Insets(5, 0, 10, 0);
        card.add(buildPasswordRow(), g);

        g.gridy = row++; g.insets = new Insets(0, 0, 14, 0);
        card.add(buildRequirementsPanel(), g);

        g.gridy = row++; g.insets = new Insets(0, 0, 0, 0);
        card.add(fieldLabel("Confirm Password"), g);

        txtConfirmPassword = new JPasswordField();
        stylePassField(txtConfirmPassword, FIELD_W);
        g.gridy = row++; g.insets = new Insets(5, 0, 24, 0);
        card.add(txtConfirmPassword, g);

        // ── REGISTER BUTTON ───────────────────────────────────────────
        btnRegister = buildRegisterButton();
        g.gridy = row++; g.insets = new Insets(0, 0, 22, 0);
        card.add(btnRegister, g);

        g.gridy = row++; g.insets = new Insets(0, 0, 16, 0);
        card.add(hairline(), g);

        // ── BACK TO LOGIN ─────────────────────────────────────────────
        lblBackToLogin = new JLabel("← Back to Login", SwingConstants.CENTER);
        lblBackToLogin.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        lblBackToLogin.setForeground(new Color(80, 90, 105));
        lblBackToLogin.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));

        g.gridy = row++; g.insets = new Insets(0, 0, 0, 0);
        card.add(lblBackToLogin, g);

        // ── EVENTS ────────────────────────────────────────────────────
        btnRegister.addActionListener(e -> attemptRegistration());
        setupLivePasswordValidation();

        lblBackToLogin.addMouseListener(new MouseAdapter() {
            @Override public void mouseClicked(MouseEvent e) {
                dispose();
                SwingUtilities.invokeLater(() -> new LoginFrame().setVisible(true));
            }
            @Override public void mouseEntered(MouseEvent e) {
                lblBackToLogin.setForeground(new Color(0, 102, 204));
            }
            @Override public void mouseExited(MouseEvent e) {
                lblBackToLogin.setForeground(new Color(80, 90, 105));
            }
        });

        return card;
    }

    // ── PASSWORD ROW (field + eye toggle) ─────────────────────────────
    private JPanel buildPasswordRow() {
        JPanel row = new JPanel(new BorderLayout());
        row.setOpaque(false);
        row.setPreferredSize(new Dimension(FIELD_W, 40));
        row.setMinimumSize(new Dimension(FIELD_W, 40));
        row.setMaximumSize(new Dimension(FIELD_W, 40));

        txtPassword = new JPasswordField();
        txtPassword.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        txtPassword.setEchoChar('•');
        txtPassword.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(1, 1, 1, 0, new Color(210, 215, 225)),
                new EmptyBorder(6, 10, 6, 6)));

        JButton eyeBtn = new JButton("Show") {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setColor(Color.WHITE);
                g2.fillRect(0, 0, getWidth(), getHeight());
                g2.dispose();
                super.paintComponent(g);
            }
        };
        eyeBtn.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        eyeBtn.setForeground(new Color(0, 102, 204));
        eyeBtn.setFocusPainted(false);
        eyeBtn.setContentAreaFilled(false);
        eyeBtn.setOpaque(false);
        eyeBtn.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        eyeBtn.setPreferredSize(new Dimension(52, 40));
        eyeBtn.setMinimumSize(new Dimension(52, 40));
        eyeBtn.setMaximumSize(new Dimension(52, 40));
        eyeBtn.setBorder(BorderFactory.createMatteBorder(1, 0, 1, 1, new Color(210, 215, 225)));

        eyeBtn.addActionListener(e -> {
            boolean showing = txtPassword.getEchoChar() == 0;
            txtPassword.setEchoChar(showing ? '•' : (char) 0);
            eyeBtn.setText(showing ? "Show" : "Hide");
        });

        row.add(txtPassword, BorderLayout.CENTER);
        row.add(eyeBtn, BorderLayout.EAST);
        return row;
    }

    // ── PASSWORD REQUIREMENTS ──────────────────────────────────────────
    private JPanel buildRequirementsPanel() {
        JPanel panel = new JPanel(new GridBagLayout());
        panel.setBackground(new Color(241, 245, 249));
        panel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(203, 213, 225), 1),
                new EmptyBorder(12, 14, 12, 14)));
        panel.setPreferredSize(new Dimension(FIELD_W, 108));
        panel.setMaximumSize(new Dimension(FIELD_W, 108));

        GridBagConstraints g = new GridBagConstraints();
        g.fill = GridBagConstraints.HORIZONTAL;
        g.gridx = 0; g.weightx = 1.0;
        int r = 0;

        JLabel title = new JLabel("Password Requirements:");
        title.setFont(new Font("Segoe UI", Font.BOLD, 12));
        title.setForeground(new Color(50, 60, 75));
        g.gridy = r++; g.insets = new Insets(0, 0, 6, 0);
        panel.add(title, g);

        lblRuleLength  = ruleLabel("At least 8 characters");
        lblRuleNumber  = ruleLabel("Contains a number");
        lblRuleSpecial = ruleLabel("Contains a special character");

        g.gridy = r++; g.insets = new Insets(0, 0, 4, 0);
        panel.add(lblRuleLength, g);
        g.gridy = r++; g.insets = new Insets(0, 0, 4, 0);
        panel.add(lblRuleNumber, g);
        g.gridy = r++; g.insets = new Insets(0, 0, 0, 0);
        panel.add(lblRuleSpecial, g);

        return panel;
    }

    // ── REGISTER BUTTON ───────────────────────────────────────────────
    private JButton buildRegisterButton() {
        JButton btn = new JButton("Register Account  →") {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(new Color(0, 102, 204));
                g2.fillRoundRect(0, 0, getWidth(), getHeight(), 8, 8);
                g2.dispose();
                super.paintComponent(g);
            }
        };
        btn.setPreferredSize(new Dimension(FIELD_W, 44));
        btn.setMaximumSize(new Dimension(FIELD_W, 44));
        btn.setFont(new Font("Segoe UI", Font.BOLD, 14));
        btn.setForeground(Color.WHITE);
        btn.setBackground(new Color(0, 102, 204));
        btn.setFocusPainted(false);
        btn.setContentAreaFilled(false);
        btn.setOpaque(false);
        btn.setBorderPainted(false);
        btn.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        return btn;
    }

    // ── HELPERS ───────────────────────────────────────────────────────
    private JLabel fieldLabel(String text) {
        JLabel lbl = new JLabel(text);
        lbl.setFont(new Font("Segoe UI", Font.BOLD, 12));
        lbl.setForeground(new Color(30, 40, 55));
        return lbl;
    }

    private JLabel ruleLabel(String text) {
        JLabel lbl = new JLabel("<html>&#9675;  " + text + "</html>");
        lbl.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        lbl.setForeground(new Color(90, 100, 115));
        return lbl;
    }

    private void stylePassField(JPasswordField f, int width) {
        f.setPreferredSize(new Dimension(width, 40));
        f.setMinimumSize(new Dimension(width, 40));
        f.setMaximumSize(new Dimension(width, 40));
        f.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        f.setEchoChar('•');
        f.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(210, 215, 225)),
                new EmptyBorder(6, 10, 6, 10)));
    }

    private JSeparator hairline() {
        JSeparator sep = new JSeparator();
        sep.setForeground(new Color(220, 226, 235));
        return sep;
    }

    private Component hgap(int w) {
        return Box.createRigidArea(new Dimension(w, 0));
    }

    private JPanel centeredRow() {
        JPanel p = new JPanel(new FlowLayout(FlowLayout.CENTER, 0, 0));
        p.setOpaque(false);
        return p;
    }

    private ImageIcon buildBankIcon() {
        int sz = 28;
        java.awt.image.BufferedImage img =
                new java.awt.image.BufferedImage(sz, sz, java.awt.image.BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2 = img.createGraphics();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        Color blue = new Color(0, 102, 204);
        g2.setColor(blue);
        g2.fillRect(3, 18, 22, 7);
        for (int x : new int[]{4, 9, 14, 19}) g2.fillRect(x, 10, 3, 9);
        g2.fillPolygon(new int[]{1, 14, 27}, new int[]{11, 3, 11}, 3);
        g2.setColor(Color.WHITE);
        g2.setStroke(new BasicStroke(1.5f));
        g2.drawLine(1, 11, 27, 11);
        g2.dispose();
        return new ImageIcon(img);
    }

    // ── LIVE PASSWORD VALIDATION ──────────────────────────────────────
    private void setupLivePasswordValidation() {
        txtPassword.getDocument().addDocumentListener(new DocumentListener() {
            public void insertUpdate(DocumentEvent e) { check(); }
            public void removeUpdate(DocumentEvent e) { check(); }
            public void changedUpdate(DocumentEvent e) { check(); }
            void check() {
                String p = new String(txtPassword.getPassword());
                rule(lblRuleLength,  p.length() >= 8,  "At least 8 characters");
                rule(lblRuleNumber,  p.matches(".*\\d.*"), "Contains a number");
                rule(lblRuleSpecial, p.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*"),
                        "Contains a special character");
            }
            void rule(JLabel lbl, boolean ok, String text) {
                if (ok) {
                    lbl.setText("<html><font color='#16a34a'>&#10003;</font>  " + text + "</html>");
                } else {
                    lbl.setText("<html>&#9675;  " + text + "</html>");
                    lbl.setForeground(new Color(90, 100, 115));
                }
            }
        });
    }

    private void attemptRegistration() {
        String name  = txtName.getText().trim();
        String email = txtEmail.getText().trim();
        String pass  = new String(txtPassword.getPassword());
        String conf  = new String(txtConfirmPassword.getPassword());

        if (InputValidator.isNullOrEmpty(name))          { showErr("Name cannot be empty."); return; }
        if (!InputValidator.isValidEmail(email))          { showErr("Please enter a valid email address."); return; }
        if (pass.length() < 8 || !pass.matches(".*\\d.*") ||
                !pass.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*"))
        { showErr("Password does not meet all requirements."); return; }
        if (!pass.equals(conf))                           { showErr("Passwords do not match!"); return; }

        UserDAO dao = new UserDAO();
        if (dao.emailExists(email)) {
            JOptionPane.showMessageDialog(this, "Email already registered!", "Error", JOptionPane.WARNING_MESSAGE);
            return;
        }
        User user = new User(name, email, pass);
        if (dao.register(user)) {
            JOptionPane.showMessageDialog(this, "Account created! You can now log in.", "Success", JOptionPane.INFORMATION_MESSAGE);
            dispose();
            SwingUtilities.invokeLater(() -> new LoginFrame().setVisible(true));
        } else {
            showErr("Database error. Please try again.");
        }
    }

    private void showErr(String msg) {
        JOptionPane.showMessageDialog(this, msg, "Error", JOptionPane.ERROR_MESSAGE);
    }

    // ── INNER: PLACEHOLDER TEXT FIELD ─────────────────────────────────
    static class PlaceholderTextField extends JTextField {
        private final String hint;

        PlaceholderTextField(String hint, int width) {
            this.hint = hint;
            setPreferredSize(new Dimension(width, 40));
            setMinimumSize(new Dimension(width, 40));
            setMaximumSize(new Dimension(width, 40));
            setFont(new Font("Segoe UI", Font.PLAIN, 14));
            setBorder(BorderFactory.createCompoundBorder(
                    BorderFactory.createLineBorder(new Color(210, 215, 225)),
                    new EmptyBorder(6, 10, 6, 10)));
        }

        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            if (getText().isEmpty() && !isFocusOwner()) {
                Graphics2D g2 = (Graphics2D) g;
                g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
                g2.setColor(new Color(170, 178, 192));
                g2.setFont(new Font("Segoe UI", Font.PLAIN, 14));
                Insets ins = getInsets();
                FontMetrics fm = g2.getFontMetrics();
                g2.drawString(hint, ins.left, (getHeight() - fm.getHeight()) / 2 + fm.getAscent());
            }
        }
    }

    public static void main(String[] args) {
        try { UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); }
        catch (Exception e) { e.printStackTrace(); }
        SwingUtilities.invokeLater(() -> new RegisterFrame().setVisible(true));
    }
}