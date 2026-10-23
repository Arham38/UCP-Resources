import javax.swing.*;
import javax.swing.border.*;
import java.awt.*;
import java.awt.event.*;   // MouseListener lives here

/**
 * Q4: Addition Calculator with MouseListener
 * ─────────────────────────────────────────────────────────────────────
 * Takes two numbers → adds them → shows result on screen (not dialog)
 * Uses MouseListener on the "Calculate" button (mouseClicked method)
 *
 * UI: Teal / dark-green cyber theme with animated result label
 */
public class Q4_AdditionMouseListener extends JFrame implements MouseListener {

    // ─── Widgets ──────────────────────────────────────────────────────
    private final JTextField num1Field;
    private final JTextField num2Field;
    private final JLabel     resultLabel;   // result shown on screen
    private final JLabel     resultValue;   // the actual number
    private final JButton    calcButton;
    private final JLabel     errorLabel;

    // ─── Palette ──────────────────────────────────────────────────────
    private static final Color BG_TOP    = new Color(5,  25, 35);
    private static final Color BG_BOTTOM = new Color(10, 50, 60);
    private static final Color CARD_BG   = new Color(255,255,255, 20);
    private static final Color ACCENT    = new Color(0, 210, 180);      // teal
    private static final Color BTN_BASE  = new Color(0, 160, 130);
    private static final Color RESULT_BG = new Color(0, 35, 30);
    private static final Color RESULT_FG = new Color(0, 255, 200);      // matrix teal
    private static final Color WHITE     = Color.WHITE;
    private static final Color LABEL_CLR = new Color(150, 230, 220);

    public Q4_AdditionMouseListener() {
        setTitle("Addition Calculator — MouseListener Demo");
        setSize(460, 540);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);

        // ── Background ────────────────────────────────────────────────
        JPanel bg = new GradientPanel(BG_TOP, BG_BOTTOM);
        bg.setLayout(new GridBagLayout());
        setContentPane(bg);

        // ── Card ──────────────────────────────────────────────────────
        JPanel card = new RoundedPanel(28, CARD_BG);
        card.setPreferredSize(new Dimension(370, 450));
        card.setLayout(new GridBagLayout());
        card.setBorder(BorderFactory.createEmptyBorder(28, 35, 28, 35));
        GridBagConstraints g = new GridBagConstraints();
        g.gridwidth = GridBagConstraints.REMAINDER;
        g.fill      = GridBagConstraints.HORIZONTAL;

        // Title
        JLabel title = new JLabel("➕  Addition Calculator", SwingConstants.CENTER);
        title.setFont(new Font("Segoe UI", Font.BOLD, 22));
        title.setForeground(WHITE);
        g.insets = new Insets(0, 0, 5, 0);
        card.add(title, g);

        JLabel sub = new JLabel("MouseListener detects the click", SwingConstants.CENTER);
        sub.setFont(new Font("Segoe UI", Font.ITALIC, 12));
        sub.setForeground(new Color(100, 200, 190));
        g.insets = new Insets(0, 0, 20, 0);
        card.add(sub, g);

        // Number 1
        card.add(fieldLabel("  First Number"), withInset(g, 4, 0, 4, 0));
        num1Field = styledField("Enter first number…");
        card.add(num1Field, withInset(g, 0, 0, 12, 0));

        // Plus symbol
        JLabel plus = new JLabel("+", SwingConstants.CENTER);
        plus.setFont(new Font("Segoe UI", Font.BOLD, 28));
        plus.setForeground(ACCENT);
        g.insets = new Insets(0, 0, 12, 0);
        card.add(plus, g);

        // Number 2
        card.add(fieldLabel("  Second Number"), withInset(g, 0, 0, 4, 0));
        num2Field = styledField("Enter second number…");
        card.add(num2Field, withInset(g, 0, 0, 18, 0));

        // Calculate button – MouseListener registered here
        calcButton = new GlowButton("  CALCULATE  +", BTN_BASE, 15);
        calcButton.setPreferredSize(new Dimension(300, 46));
        calcButton.addMouseListener(this);   // ← Q4 requirement
        g.insets = new Insets(0, 0, 14, 0);
        card.add(calcButton, g);

        // Error label (hidden until needed)
        errorLabel = new JLabel("", SwingConstants.CENTER);
        errorLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        errorLabel.setForeground(new Color(255, 100, 100));
        g.insets = new Insets(0, 0, 8, 0);
        card.add(errorLabel, g);

        // Result box (on-screen display – Q4 requirement)
        JPanel resultBox = new RoundedPanel(16, RESULT_BG);
        resultBox.setPreferredSize(new Dimension(300, 70));
        resultBox.setLayout(new GridBagLayout());
        resultBox.setBorder(BorderFactory.createCompoundBorder(
            new RoundedBorder(16, ACCENT),
            BorderFactory.createEmptyBorder(5, 10, 5, 10)
        ));

        GridBagConstraints rg = new GridBagConstraints();
        rg.gridwidth = GridBagConstraints.REMAINDER;

        resultLabel = new JLabel("Result", SwingConstants.CENTER);
        resultLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        resultLabel.setForeground(new Color(100, 200, 190));
        resultBox.add(resultLabel, rg);

        resultValue = new JLabel("—", SwingConstants.CENTER);
        resultValue.setFont(new Font("Courier New", Font.BOLD, 30));
        resultValue.setForeground(RESULT_FG);
        resultBox.add(resultValue, rg);

        g.insets = new Insets(0, 0, 0, 0);
        card.add(resultBox, g);

        bg.add(card);
        setVisible(true);
    }

    // ════════════════════════════════════════════════════════════════
    //  MOUSE LISTENER  (Q4 requirement — perform addition on click)
    // ════════════════════════════════════════════════════════════════

    @Override
    public void mouseClicked(MouseEvent e) {
        // This fires when the mouse is pressed AND released on the button
        if (e.getSource() == calcButton) {
            performAddition();
        }
    }

    // The other four methods are required by the interface but we leave them empty
    @Override public void mousePressed (MouseEvent e) { /* not used */ }
    @Override public void mouseReleased(MouseEvent e) { /* not used */ }
    @Override public void mouseEntered (MouseEvent e) {
        // Subtle hover glow effect
        calcButton.setBackground(BTN_BASE.brighter());
    }
    @Override public void mouseExited  (MouseEvent e) {
        calcButton.setBackground(BTN_BASE);
    }

    // ── Core logic ──
    private void performAddition() {
        errorLabel.setText("");
        try {
            double a = Double.parseDouble(num1Field.getText().trim());
            double b = Double.parseDouble(num2Field.getText().trim());
            double sum = a + b;

            // Show result on screen (label, not dialog)
            resultLabel.setText(num1Field.getText().trim() + "  +  " + num2Field.getText().trim() + "  =");

            // Format: if whole number, show without .0
            if (sum == Math.floor(sum) && !Double.isInfinite(sum))
                resultValue.setText(String.valueOf((long) sum));
            else
                resultValue.setText(String.valueOf(sum));

        } catch (NumberFormatException ex) {
            errorLabel.setText("⚠  Please enter valid numbers in both fields.");
            resultValue.setText("—");
            resultLabel.setText("Result");
        }
    }

    // ════════════════════════════════════════════════════════════════
    //  Helpers
    // ════════════════════════════════════════════════════════════════
    private JLabel fieldLabel(String text) {
        JLabel lbl = new JLabel(text);
        lbl.setFont(new Font("Segoe UI", Font.BOLD, 13));
        lbl.setForeground(LABEL_CLR);
        return lbl;
    }
    private JTextField styledField(String ph) {
        JTextField tf = new JTextField(ph);
        tf.setPreferredSize(new Dimension(300, 42));
        tf.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        tf.setForeground(ACCENT);
        tf.setCaretColor(WHITE);
        tf.setOpaque(false);
        tf.setBorder(BorderFactory.createCompoundBorder(
            new RoundedBorder(10, ACCENT),
            BorderFactory.createEmptyBorder(5, 12, 5, 12)
        ));
        return tf;
    }
    private GridBagConstraints withInset(GridBagConstraints b, int t, int l, int bot, int r) {
        b.insets = new Insets(t, l, bot, r); return b;
    }

    // ── Shared custom components (same design system) ──
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
    static class GlowButton extends JButton {
        private final Color base;
        GlowButton(String txt, Color base, int fs) {
            super(txt); this.base=base;
            setFont(new Font("Segoe UI",Font.BOLD,fs));
            setForeground(Color.WHITE);
            setFocusPainted(false); setBorderPainted(false); setContentAreaFilled(false);
            setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        }
        @Override protected void paintComponent(Graphics g) {
            Graphics2D g2=(Graphics2D)g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,RenderingHints.VALUE_ANTIALIAS_ON);
            g2.setColor(new Color(base.getRed(),base.getGreen(),base.getBlue(),55));
            g2.fillRoundRect(3,5,getWidth()-6,getHeight()-2,24,24);
            g2.setPaint(new GradientPaint(0,0,base.brighter(),0,getHeight(),base.darker()));
            g2.fillRoundRect(0,0,getWidth(),getHeight()-3,24,24);
            g2.dispose(); super.paintComponent(g);
        }
    }

    public static void main(String[] args) {
        try { UIManager.setLookAndFeel(UIManager.getCrossPlatformLookAndFeelClassName()); }
        catch (Exception ignored) {}
        SwingUtilities.invokeLater(Q4_AdditionMouseListener::new);
    }
}
