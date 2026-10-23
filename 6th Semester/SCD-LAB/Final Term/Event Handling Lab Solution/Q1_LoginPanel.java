import javax.swing.*;
import javax.swing.border.*;
import java.awt.*;
import java.awt.geom.*;

/**
 * Q1: Login Panel GUI - Design Only (No Event Handling)
 * Frame Title: "JPanel Demo Program"
 * Features stunning gradient background, glass-morphism style login panel
 */
public class Q1_LoginPanel extends JFrame {

    // ─── Custom Colors ───────────────────────────────────────────────
    private static final Color BG_TOP    = new Color(15, 32, 65);    // deep navy
    private static final Color BG_BOTTOM = new Color(30, 80, 140);   // ocean blue
    private static final Color PANEL_BG  = new Color(255, 255, 255, 30); // translucent white
    private static final Color ACCENT    = new Color(99, 179, 237);  // sky blue
    private static final Color BTN_COLOR = new Color(56, 161, 105);  // green
    private static final Color WHITE     = Color.WHITE;

    public Q1_LoginPanel() {
        setTitle("JPanel Demo Program");
        setSize(480, 560);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);

        // Gradient background panel as the content pane
        JPanel background = new GradientPanel(BG_TOP, BG_BOTTOM);
        background.setLayout(new GridBagLayout());
        setContentPane(background);

        // ─── Login Panel (inner card) ──────────────────────────────
        JPanel loginPanel = new RoundedPanel(30, new Color(255, 255, 255, 25));
        loginPanel.setLayout(new GridBagLayout());
        loginPanel.setPreferredSize(new Dimension(360, 400));
        loginPanel.setBorder(BorderFactory.createEmptyBorder(30, 35, 30, 35));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 0, 10, 0);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.gridwidth = GridBagConstraints.REMAINDER;

        // ── Panel title ──
        JLabel titleLabel = new JLabel("🔐  Login Panel", SwingConstants.CENTER);
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 22));
        titleLabel.setForeground(WHITE);
        gbc.insets = new Insets(0, 0, 25, 0);
        loginPanel.add(titleLabel, gbc);

        // ── Subtitle ──
        JLabel subtitle = new JLabel("Welcome back! Please sign in.", SwingConstants.CENTER);
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        subtitle.setForeground(new Color(180, 210, 255));
        gbc.insets = new Insets(0, 0, 20, 0);
        loginPanel.add(subtitle, gbc);

        // ── Separator line ──
        JSeparator sep = new JSeparator();
        sep.setForeground(new Color(99, 179, 237, 80));
        gbc.insets = new Insets(0, 0, 20, 0);
        loginPanel.add(sep, gbc);

        // ── Username Label ──
        JLabel userLabel = new JLabel("  Username");
        userLabel.setFont(new Font("Segoe UI", Font.BOLD, 13));
        userLabel.setForeground(ACCENT);
        gbc.insets = new Insets(5, 0, 3, 0);
        loginPanel.add(userLabel, gbc);

        // ── Username Field ──
        JTextField userField = new StyledTextField("Enter your username");
        gbc.insets = new Insets(0, 0, 12, 0);
        loginPanel.add(userField, gbc);

        // ── Password Label ──
        JLabel passLabel = new JLabel("  Password");
        passLabel.setFont(new Font("Segoe UI", Font.BOLD, 13));
        passLabel.setForeground(ACCENT);
        gbc.insets = new Insets(5, 0, 3, 0);
        loginPanel.add(passLabel, gbc);

        // ── Password Field ──
        JPasswordField passField = new JPasswordField();
        stylePasswordField(passField);
        gbc.insets = new Insets(0, 0, 25, 0);
        loginPanel.add(passField, gbc);

        // ── Login Button ──
        JButton loginBtn = new RoundedButton("  LOGIN", BTN_COLOR);
        loginBtn.setPreferredSize(new Dimension(290, 45));
        gbc.insets = new Insets(10, 0, 5, 0);
        loginPanel.add(loginBtn, gbc);

        // ── Bottom note ──
        JLabel note = new JLabel("Forgot password? Reset here", SwingConstants.CENTER);
        note.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        note.setForeground(new Color(150, 190, 255));
        gbc.insets = new Insets(10, 0, 0, 0);
        loginPanel.add(note, gbc);

        // Add login panel to background
        background.add(loginPanel);
        setVisible(true);
    }

    // ── Utility: style the password field ──
    private void stylePasswordField(JPasswordField f) {
        f.setPreferredSize(new Dimension(290, 42));
        f.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        f.setForeground(WHITE);
        f.setBackground(new Color(255, 255, 255, 20));
        f.setCaretColor(WHITE);
        f.setBorder(BorderFactory.createCompoundBorder(
            new RoundedBorder(10, ACCENT),
            BorderFactory.createEmptyBorder(5, 12, 5, 12)
        ));
        f.setOpaque(false);
    }

    // ════════════════════════════════════════════════════════════════
    //  Inner Classes – Custom UI Components
    // ════════════════════════════════════════════════════════════════

    /** Panel that paints a top-to-bottom gradient */
    static class GradientPanel extends JPanel {
        private final Color top, bottom;
        GradientPanel(Color top, Color bottom) {
            this.top = top; this.bottom = bottom;
            setOpaque(true);
        }
        @Override protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D) g;
            g2.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
            GradientPaint gp = new GradientPaint(0, 0, top, 0, getHeight(), bottom);
            g2.setPaint(gp);
            g2.fillRect(0, 0, getWidth(), getHeight());
        }
    }

    /** Panel with rounded corners and translucent fill */
    static class RoundedPanel extends JPanel {
        private final int arc;
        private final Color fill;
        RoundedPanel(int arc, Color fill) {
            this.arc = arc; this.fill = fill;
            setOpaque(false);
        }
        @Override protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2.setColor(fill);
            g2.fillRoundRect(0, 0, getWidth(), getHeight(), arc, arc);
            // subtle border
            g2.setColor(new Color(255, 255, 255, 60));
            g2.setStroke(new BasicStroke(1.5f));
            g2.drawRoundRect(1, 1, getWidth()-2, getHeight()-2, arc, arc);
            g2.dispose();
            super.paintComponent(g);
        }
    }

    /** Stylish text field with rounded border */
    static class StyledTextField extends JTextField {
        StyledTextField(String placeholder) {
            setText(placeholder);
            setPreferredSize(new Dimension(290, 42));
            setFont(new Font("Segoe UI", Font.PLAIN, 14));
            setForeground(new Color(180, 200, 255));
            setBackground(new Color(255, 255, 255, 20));
            setCaretColor(Color.WHITE);
            setOpaque(false);
            setBorder(BorderFactory.createCompoundBorder(
                new RoundedBorder(10, new Color(99, 179, 237)),
                BorderFactory.createEmptyBorder(5, 12, 5, 12)
            ));
        }
    }

    /** Rounded border with custom color */
    static class RoundedBorder extends AbstractBorder {
        private final int radius;
        private final Color color;
        RoundedBorder(int radius, Color color) { this.radius = radius; this.color = color; }
        @Override public void paintBorder(Component c, Graphics g, int x, int y, int w, int h) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2.setColor(color);
            g2.setStroke(new BasicStroke(1.5f));
            g2.drawRoundRect(x, y, w-1, h-1, radius, radius);
            g2.dispose();
        }
    }

    /** Pill-shaped button with hover effect (design only) */
    static class RoundedButton extends JButton {
        private final Color base;
        RoundedButton(String text, Color base) {
            super(text);
            this.base = base;
            setFont(new Font("Segoe UI", Font.BOLD, 14));
            setForeground(Color.WHITE);
            setFocusPainted(false);
            setBorderPainted(false);
            setContentAreaFilled(false);
            setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        }
        @Override protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            GradientPaint gp = new GradientPaint(0, 0, base.brighter(), 0, getHeight(), base.darker());
            g2.setPaint(gp);
            g2.fillRoundRect(0, 0, getWidth(), getHeight(), 25, 25);
            g2.dispose();
            super.paintComponent(g);
        }
    }

    public static void main(String[] args) {
        // Use system look and feel as base, then override with our custom painting
        try { UIManager.setLookAndFeel(UIManager.getCrossPlatformLookAndFeelClassName()); }
        catch (Exception ignored) {}
        SwingUtilities.invokeLater(Q1_LoginPanel::new);
    }
}
