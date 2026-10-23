import javax.swing.*;
import javax.swing.border.*;
import java.awt.*;
import java.awt.event.*;   // KeyListener lives here

/**
 * Q5: Number Checker with KeyListener
 * ─────────────────────────────────────────────────────────────────────
 * User types a number → KeyListener detects keyboard input →
 * JLabel on screen shows: "Positive Number" / "Negative Number" / "Zero"
 *
 * UI: Warm amber / dark-orange theme, live response as you type
 */
public class Q5_NumberCheckerKeyListener extends JFrame implements KeyListener {

    // ─── Widgets ──────────────────────────────────────────────────────
    private final JTextField inputField;
    private final JLabel     statusLabel;    // shows Positive / Negative / Zero
    private final JLabel     iconLabel;      // emoji icon
    private final JLabel     descLabel;      // brief description

    // ─── Palette ──────────────────────────────────────────────────────
    private static final Color BG_TOP     = new Color(30, 15, 5);
    private static final Color BG_BOTTOM  = new Color(60, 30, 5);
    private static final Color CARD_BG    = new Color(255, 255, 255, 20);
    private static final Color ACCENT     = new Color(251, 146, 60);   // amber
    private static final Color BOX_BG     = new Color(40, 20, 5);
    private static final Color POS_COLOR  = new Color(74, 222, 128);   // green
    private static final Color NEG_COLOR  = new Color(248, 113, 113);  // red
    private static final Color ZERO_COLOR = new Color(147, 197, 253);  // blue
    private static final Color IDLE_COLOR = new Color(160, 140, 120);
    private static final Color WHITE      = Color.WHITE;

    public Q5_NumberCheckerKeyListener() {
        setTitle("Number Checker — KeyListener Demo");
        setSize(440, 500);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);

        // ── Background ────────────────────────────────────────────────
        JPanel bg = new GradientPanel(BG_TOP, BG_BOTTOM);
        bg.setLayout(new GridBagLayout());
        setContentPane(bg);

        // ── Card ──────────────────────────────────────────────────────
        JPanel card = new RoundedPanel(28, CARD_BG);
        card.setPreferredSize(new Dimension(360, 400));
        card.setLayout(new GridBagLayout());
        card.setBorder(BorderFactory.createEmptyBorder(30, 35, 30, 35));
        GridBagConstraints g = new GridBagConstraints();
        g.gridwidth = GridBagConstraints.REMAINDER;
        g.fill      = GridBagConstraints.HORIZONTAL;

        // Title
        JLabel title = new JLabel("🔢  Number Checker", SwingConstants.CENTER);
        title.setFont(new Font("Segoe UI", Font.BOLD, 23));
        title.setForeground(WHITE);
        g.insets = new Insets(0, 0, 5, 0);
        card.add(title, g);

        JLabel sub = new JLabel("KeyListener updates result as you type", SwingConstants.CENTER);
        sub.setFont(new Font("Segoe UI", Font.ITALIC, 12));
        sub.setForeground(ACCENT);
        g.insets = new Insets(0, 0, 22, 0);
        card.add(sub, g);

        // Instruction label
        JLabel lbl = new JLabel("  Enter any number:");
        lbl.setFont(new Font("Segoe UI", Font.BOLD, 13));
        lbl.setForeground(new Color(255, 200, 140));
        g.insets = new Insets(0, 0, 5, 0);
        card.add(lbl, g);

        // Input field – KeyListener registered here
        inputField = new JTextField();
        inputField.setPreferredSize(new Dimension(290, 48));
        inputField.setFont(new Font("Courier New", Font.BOLD, 20));
        inputField.setForeground(ACCENT);
        inputField.setCaretColor(WHITE);
        inputField.setOpaque(false);
        inputField.setBorder(BorderFactory.createCompoundBorder(
            new RoundedBorder(12, ACCENT),
            BorderFactory.createEmptyBorder(5, 14, 5, 14)
        ));
        inputField.setHorizontalAlignment(SwingConstants.CENTER);
        inputField.addKeyListener(this);   // ← Q5 requirement
        g.insets = new Insets(0, 0, 24, 0);
        card.add(inputField, g);

        // ── Result display box ────────────────────────────────────────
        JPanel resultBox = new RoundedPanel(18, new Color(0, 0, 0, 50));
        resultBox.setPreferredSize(new Dimension(290, 140));
        resultBox.setLayout(new GridBagLayout());
        resultBox.setBorder(BorderFactory.createCompoundBorder(
            new RoundedBorder(18, new Color(255, 255, 255, 35)),
            BorderFactory.createEmptyBorder(10, 10, 10, 10)
        ));

        GridBagConstraints rg = new GridBagConstraints();
        rg.gridwidth = GridBagConstraints.REMAINDER;

        iconLabel = new JLabel("❓", SwingConstants.CENTER);
        iconLabel.setFont(new Font("Segoe UI", Font.PLAIN, 40));
        rg.insets = new Insets(0, 0, 5, 0);
        resultBox.add(iconLabel, rg);

        statusLabel = new JLabel("Waiting for input…", SwingConstants.CENTER);
        statusLabel.setFont(new Font("Segoe UI", Font.BOLD, 20));
        statusLabel.setForeground(IDLE_COLOR);
        rg.insets = new Insets(0, 0, 4, 0);
        resultBox.add(statusLabel, rg);

        descLabel = new JLabel("Start typing above", SwingConstants.CENTER);
        descLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        descLabel.setForeground(new Color(140, 130, 115));
        rg.insets = new Insets(0, 0, 0, 0);
        resultBox.add(descLabel, rg);

        g.insets = new Insets(0, 0, 0, 0);
        card.add(resultBox, g);

        bg.add(card);
        setVisible(true);
        inputField.requestFocusInWindow();
    }

    // ════════════════════════════════════════════════════════════════
    //  KEY LISTENER  (Q5 requirement — check number on key press)
    // ════════════════════════════════════════════════════════════════

    @Override
    public void keyReleased(KeyEvent e) {
        // keyReleased fires AFTER the character is committed to the text field,
        // so inputField.getText() already contains the latest full value.
        checkNumber();
    }

    // keyTyped and keyPressed are required by the interface; we leave them empty
    // because we only need to react after the field text is fully updated.
    @Override public void keyTyped  (KeyEvent e) { /* not used */ }
    @Override public void keyPressed(KeyEvent e) { /* not used */ }

    // ── Core logic ──
    private void checkNumber() {
        String text = inputField.getText().trim();

        if (text.isEmpty() || text.equals("-") || text.equals(".")) {
            // Field is empty or has only a minus sign – reset display
            statusLabel.setText("Waiting for input…");
            statusLabel.setForeground(IDLE_COLOR);
            iconLabel.setText("❓");
            descLabel.setText("Start typing above");
            return;
        }

        try {
            double number = Double.parseDouble(text);

            if (number > 0) {
                // ── Positive ──
                statusLabel.setText("Positive Number");
                statusLabel.setForeground(POS_COLOR);
                iconLabel.setText("⬆");
                descLabel.setText(text + " is greater than zero");

            } else if (number < 0) {
                // ── Negative ──
                statusLabel.setText("Negative Number");
                statusLabel.setForeground(NEG_COLOR);
                iconLabel.setText("⬇");
                descLabel.setText(text + " is less than zero");

            } else {
                // ── Zero ──
                statusLabel.setText("Zero");
                statusLabel.setForeground(ZERO_COLOR);
                iconLabel.setText("⚬");
                descLabel.setText("The number is exactly 0");
            }

        } catch (NumberFormatException ex) {
            // User typed something non-numeric
            statusLabel.setText("Invalid Input");
            statusLabel.setForeground(new Color(255, 120, 50));
            iconLabel.setText("⚠");
            descLabel.setText("Please enter a valid number");
        }
    }

    // ════════════════════════════════════════════════════════════════
    //  Shared custom components (same design system as other files)
    // ════════════════════════════════════════════════════════════════
    static class GradientPanel extends JPanel {
        private final Color top, bot;
        GradientPanel(Color top, Color bot) { this.top=top; this.bot=bot; }
        @Override protected void paintComponent(Graphics g) {
            Graphics2D g2=(Graphics2D)g;
            g2.setPaint(new GradientPaint(0,0,top,0,getHeight(),bot));
            g2.fillRect(0,0,getWidth(),getHeight());
        }
    }
    static class RoundedPanel extends JPanel {
        private final int arc; private final Color fill;
        RoundedPanel(int arc, Color fill) { this.arc=arc; this.fill=fill; setOpaque(false); }
        @Override protected void paintComponent(Graphics g) {
            Graphics2D g2=(Graphics2D)g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,RenderingHints.VALUE_ANTIALIAS_ON);
            g2.setColor(fill); g2.fillRoundRect(0,0,getWidth(),getHeight(),arc,arc);
            g2.setColor(new Color(255,255,255,40)); g2.setStroke(new BasicStroke(1.2f));
            g2.drawRoundRect(1,1,getWidth()-2,getHeight()-2,arc,arc);
            g2.dispose(); super.paintComponent(g);
        }
    }
    static class RoundedBorder extends AbstractBorder {
        private final int r; private final Color c;
        RoundedBorder(int r, Color c) { this.r=r; this.c=c; }
        @Override public void paintBorder(Component comp, Graphics g, int x, int y, int w, int h) {
            Graphics2D g2=(Graphics2D)g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,RenderingHints.VALUE_ANTIALIAS_ON);
            g2.setColor(c); g2.setStroke(new BasicStroke(1.5f));
            g2.drawRoundRect(x,y,w-1,h-1,r,r); g2.dispose();
        }
    }

    public static void main(String[] args) {
        try { UIManager.setLookAndFeel(UIManager.getCrossPlatformLookAndFeelClassName()); }
        catch (Exception ignored) {}
        SwingUtilities.invokeLater(Q5_NumberCheckerKeyListener::new);
    }
}
