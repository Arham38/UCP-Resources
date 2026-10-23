// FIXED: Login button paint, wallet icon, field icons, and layout aligned to mockup
package com.expensesplitter.ui;

import com.expensesplitter.Session;
import com.expensesplitter.dao.UserDAO;
import com.expensesplitter.models.User;
import com.expensesplitter.validation.InputValidator;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;

public class LoginFrame extends JFrame {

    private static final int CARD_W = 390;
    private static final int FIELD_W = CARD_W - 72;

    private JTextField txtEmail;
    private JPasswordField txtPassword;

    public LoginFrame() {
        setTitle("Expense Splitter - Login");
        setSize(500, 640);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);
        getContentPane().setBackground(new Color(245, 247, 250));
        initComponents();
    }

    private void initComponents() {
        setLayout(new GridBagLayout());

        JPanel card = new JPanel(new GridBagLayout());
        card.setBackground(Color.WHITE);
        card.setPreferredSize(new Dimension(CARD_W, 520));
        card.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(220, 224, 230)),
                new EmptyBorder(36, 36, 32, 36)));

        GridBagConstraints g = new GridBagConstraints();
        g.fill = GridBagConstraints.HORIZONTAL;
        g.gridx = 0;
        g.weightx = 1.0;
        int row = 0;

        // Logo
        JLabel iconLbl = new JLabel(buildWalletIcon(48));
        iconLbl.setHorizontalAlignment(SwingConstants.CENTER);
        g.gridy = row++;
        g.insets = new Insets(0, 0, 12, 0);
        card.add(iconLbl, g);

        // Title
        JLabel lblTitle = new JLabel("Expense Splitter Application", SwingConstants.CENTER);
        lblTitle.setFont(new Font("Segoe UI", Font.BOLD, 22));
        lblTitle.setForeground(new Color(33, 37, 41));
        g.gridy = row++;
        g.insets = new Insets(0, 0, 20, 0);
        card.add(lblTitle, g);

        // Divider
        g.gridy = row++;
        g.insets = new Insets(0, 0, 22, 0);
        card.add(hairline(), g);

        // Email
        g.gridy = row++;
        g.insets = new Insets(0, 0, 0, 0);
        card.add(fieldLabel("Email Address"), g);

        txtEmail = new PlaceholderField("user@domain.com");
        styleInput(txtEmail);
        JPanel emailRow = wrapWithIcon("✉", txtEmail);
        g.gridy = row++;
        g.insets = new Insets(6, 0, 16, 0);
        card.add(emailRow, g);

        // Password
        g.gridy = row++;
        g.insets = new Insets(0, 0, 0, 0);
        card.add(fieldLabel("Password"), g);

        txtPassword = new JPasswordField();
        txtPassword.setEchoChar('•');
        styleInput(txtPassword);
        JPanel passwordRow = wrapWithIcon("🔒", txtPassword);
        g.gridy = row++;
        g.insets = new Insets(6, 0, 24, 0);
        card.add(passwordRow, g);

        // Login button
        JButton btnLogin = buildLoginButton();
        btnLogin.addActionListener(e -> attemptLogin());
        g.gridy = row++;
        g.insets = new Insets(0, 0, 22, 0);
        card.add(btnLogin, g);

        // Divider
        g.gridy = row++;
        g.insets = new Insets(0, 0, 18, 0);
        card.add(hairline(), g);

        // Forgot password
        JLabel lblForgot = linkLabel("Forgot Password?", new Color(0, 102, 204));
        lblForgot.setHorizontalAlignment(SwingConstants.CENTER);
        g.gridy = row++;
        g.insets = new Insets(0, 0, 10, 0);
        card.add(lblForgot, g);

        // Register
        JLabel lblRegister = linkLabel("Register New Account", new Color(120, 130, 145));
        lblRegister.setHorizontalAlignment(SwingConstants.CENTER);
        lblRegister.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                dispose();
                SwingUtilities.invokeLater(() -> new RegisterFrame().setVisible(true));
            }
            @Override
            public void mouseEntered(MouseEvent e) { lblRegister.setForeground(new Color(33, 37, 41)); }
            @Override
            public void mouseExited(MouseEvent e) { lblRegister.setForeground(new Color(120, 130, 145)); }
        });
        g.gridy = row++;
        g.insets = new Insets(0, 0, 0, 0);
        card.add(lblRegister, g);

        add(card);
    }

    private JLabel fieldLabel(String text) {
        JLabel lbl = new JLabel(text);
        lbl.setFont(new Font("Segoe UI", Font.BOLD, 12));
        lbl.setForeground(new Color(60, 70, 85));
        return lbl;
    }

    private void styleInput(JComponent field) {
        field.setBorder(BorderFactory.createEmptyBorder(8, 4, 8, 10));
        field.setFont(new Font("Segoe UI", Font.PLAIN, 14));
    }

    private JPanel wrapWithIcon(String icon, JComponent field) {
        JPanel wrapper = new JPanel(new BorderLayout(0, 0));
        wrapper.setBackground(Color.WHITE);
        wrapper.setPreferredSize(new Dimension(FIELD_W, 40));
        wrapper.setMaximumSize(new Dimension(FIELD_W, 40));
        wrapper.setBorder(BorderFactory.createLineBorder(new Color(210, 215, 225)));

        JLabel iconLbl = new JLabel(icon);
        iconLbl.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        iconLbl.setForeground(new Color(140, 150, 165));
        iconLbl.setBorder(new EmptyBorder(0, 12, 0, 4));
        iconLbl.setPreferredSize(new Dimension(36, 40));

        wrapper.add(iconLbl, BorderLayout.WEST);
        wrapper.add(field, BorderLayout.CENTER);
        return wrapper;
    }

    private JButton buildLoginButton() {
        JButton btn = new JButton("Login  →") {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(new Color(0, 102, 204));
                g2.fillRoundRect(0, 0, getWidth(), getHeight(), 6, 6);
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

    private JLabel linkLabel(String text, Color color) {
        JLabel lbl = new JLabel(text);
        lbl.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        lbl.setForeground(color);
        lbl.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        return lbl;
    }

    private JSeparator hairline() {
        JSeparator sep = new JSeparator();
        sep.setForeground(new Color(220, 226, 235));
        return sep;
    }

    private ImageIcon buildWalletIcon(int size) {
        BufferedImage img = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2 = img.createGraphics();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Light blue rounded square background
        g2.setColor(new Color(190, 216, 255));
        g2.fillRoundRect(0, 0, size, size, 8, 8);

        // "C" letter in blue
        Color blue = new Color(0, 102, 204);
        g2.setColor(blue);
        g2.setFont(new Font("Segoe UI", Font.BOLD, size - 12));
        FontMetrics fm = g2.getFontMetrics();
        String text = "C";
        int x = (size - fm.stringWidth(text)) / 2;
        int y = ((size - fm.getHeight()) / 2) + fm.getAscent();
        g2.drawString(text, x, y);

        g2.dispose();
        return new ImageIcon(img);
    }

    private void attemptLogin() {
        String email = txtEmail.getText().trim();
        String password = new String(txtPassword.getPassword());

        if (!InputValidator.isValidEmail(email)) {
            JOptionPane.showMessageDialog(this, "Please enter a valid email address.",
                    "Validation Error", JOptionPane.ERROR_MESSAGE);
            return;
        }
        if (InputValidator.isNullOrEmpty(password)) {
            JOptionPane.showMessageDialog(this, "Password cannot be empty.",
                    "Validation Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        User loggedInUser = new UserDAO().login(email, password);
        if (loggedInUser != null) {
            Session.setCurrentUser(loggedInUser);
            dispose();
            SwingUtilities.invokeLater(() -> new DashboardFrame().setVisible(true));
        } else {
            JOptionPane.showMessageDialog(this, "Invalid email or password. Please try again.",
                    "Authentication Failed", JOptionPane.ERROR_MESSAGE);
        }
    }

    /** Text field with placeholder hint text. */
    static class PlaceholderField extends JTextField {
        private final String hint;

        PlaceholderField(String hint) {
            this.hint = hint;
        }

        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            if (getText().isEmpty() && !isFocusOwner()) {
                Graphics2D g2 = (Graphics2D) g;
                g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
                g2.setColor(new Color(170, 178, 192));
                g2.setFont(getFont());
                Insets ins = getInsets();
                FontMetrics fm = g2.getFontMetrics();
                g2.drawString(hint, ins.left, (getHeight() + fm.getAscent() - fm.getDescent()) / 2);
            }
        }
    }
}
