import javax.swing.*;
import javax.swing.border.*;
import java.awt.*;
import java.awt.geom.*;

/**
 * Q2: TV Remote Controller - Design Only (No Event Handling)
 * Beautiful modern remote with gradient body, glowing buttons,
 * Power, Channel, Volume, and Media source controls.
 */
public class Q2_TVRemote extends JFrame {

    // ─── Palette ─────────────────────────────────────────────────────
    private static final Color BODY_TOP    = new Color(28, 28, 40);
    private static final Color BODY_BOTTOM = new Color(18, 18, 28);
    private static final Color RED_BTN     = new Color(220, 53, 69);
    private static final Color GREEN_BTN   = new Color(40, 167, 69);
    private static final Color BLUE_BTN    = new Color(0, 123, 255);
    private static final Color YELLOW_BTN  = new Color(255, 193, 7);
    private static final Color NAV_BTN     = new Color(55, 65, 90);
    private static final Color NAV_HOVER   = new Color(70, 85, 115);
    private static final Color TEXT_DIM    = new Color(160, 170, 200);
    private static final Color DISPLAY_BG  = new Color(10, 20, 45);
    private static final Color DISPLAY_FG  = new Color(0, 255, 160);   // matrix green
    private static final Color GLOW_CYAN   = new Color(0, 210, 255);

    public Q2_TVRemote() {
        setTitle("TV Remote Controller");
        setSize(340, 760);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);

        // Dark gradient background
        JPanel bg = new GradientBg(new Color(10, 10, 20), new Color(25, 30, 55));
        bg.setLayout(new GridBagLayout());
        setContentPane(bg);

        // ── Remote body ──────────────────────────────────────────────
        JPanel remote = new RemoteBody();
        remote.setLayout(new BoxLayout(remote, BoxLayout.Y_AXIS));
        remote.setPreferredSize(new Dimension(270, 700));
        remote.setBorder(BorderFactory.createEmptyBorder(20, 22, 20, 22));

        // ── Brand bar at top ──
        remote.add(makeBrandBar());
        remote.add(Box.createVerticalStrut(12));

        // ── Mini LCD display ──
        remote.add(makeLCDDisplay());
        remote.add(Box.createVerticalStrut(14));

        // ── Power button (big, centred, red) ──
        remote.add(makeCenteredRow(makePowerButton()));
        remote.add(Box.createVerticalStrut(14));

        // ── Divider ──
        remote.add(makeDivider());
        remote.add(Box.createVerticalStrut(10));

        // ── Section label: CHANNEL ──
        remote.add(sectionLabel("CHANNEL"));
        remote.add(Box.createVerticalStrut(6));

        // ── Channel Up / Down ──
        remote.add(makeRow(
            makeNavButton("CH ▲", "Channel Up",  BLUE_BTN),
            makeNavButton("CH ▼", "Channel Down", NAV_BTN)
        ));
        remote.add(Box.createVerticalStrut(12));

        // ── Section label: VOLUME ──
        remote.add(sectionLabel("VOLUME"));
        remote.add(Box.createVerticalStrut(6));

        // ── Volume Up / Down ──
        remote.add(makeRow(
            makeNavButton("VOL +", "Volume Up",   GREEN_BTN),
            makeNavButton("VOL −", "Volume Down",  NAV_BTN)
        ));
        remote.add(Box.createVerticalStrut(14));

        // ── Divider ──
        remote.add(makeDivider());
        remote.add(Box.createVerticalStrut(10));

        // ── Section label: INPUT SOURCE ──
        remote.add(sectionLabel("INPUT SOURCE"));
        remote.add(Box.createVerticalStrut(8));

        // ── Media source buttons ──
        remote.add(makeMediaRow());
        remote.add(Box.createVerticalStrut(14));

        // ── Number pad (decorative) ──
        remote.add(sectionLabel("KEYPAD"));
        remote.add(Box.createVerticalStrut(6));
        remote.add(makeNumpad());
        remote.add(Box.createVerticalStrut(10));

        bg.add(remote);
        setVisible(true);
    }

    // ════════════════════════════════════════════════════════════════
    //  Component Builders
    // ════════════════════════════════════════════════════════════════

    private JPanel makeBrandBar() {
        JPanel p = transparent();
        p.setLayout(new BorderLayout());

        JLabel brand = new JLabel("VIZIO   🖥", SwingConstants.CENTER);
        brand.setFont(new Font("Segoe UI", Font.BOLD, 18));
        brand.setForeground(GLOW_CYAN);
        brand.setAlignmentX(CENTER_ALIGNMENT);

        JLabel subtitle = new JLabel("Smart Remote  •  v3.0", SwingConstants.CENTER);
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 10));
        subtitle.setForeground(TEXT_DIM);

        JPanel inner = new JPanel();
        inner.setOpaque(false);
        inner.setLayout(new BoxLayout(inner, BoxLayout.Y_AXIS));
        brand.setAlignmentX(CENTER_ALIGNMENT);
        subtitle.setAlignmentX(CENTER_ALIGNMENT);
        inner.add(brand); inner.add(Box.createVerticalStrut(2)); inner.add(subtitle);
        p.add(inner, BorderLayout.CENTER);
        return p;
    }

    private JPanel makeLCDDisplay() {
        JPanel display = new RoundedSolid(12, DISPLAY_BG);
        display.setPreferredSize(new Dimension(226, 52));
        display.setMaximumSize(new Dimension(Integer.MAX_VALUE, 52));
        display.setBorder(BorderFactory.createEmptyBorder(8, 14, 8, 14));
        display.setLayout(new BorderLayout());

        JLabel ch = new JLabel("CH  07", SwingConstants.LEFT);
        ch.setFont(new Font("Courier New", Font.BOLD, 16));
        ch.setForeground(DISPLAY_FG);

        JLabel vol = new JLabel("VOL 32", SwingConstants.RIGHT);
        vol.setFont(new Font("Courier New", Font.BOLD, 16));
        vol.setForeground(DISPLAY_FG);

        display.add(ch, BorderLayout.WEST);
        display.add(vol, BorderLayout.EAST);
        return display;
    }

    /** Big glowing power button */
    private JButton makePowerButton() {
        JButton btn = new GlowButton("⏻  POWER", RED_BTN, 38, 26);
        btn.setPreferredSize(new Dimension(160, 46));
        btn.setMaximumSize(new Dimension(160, 46));
        return btn;
    }

    /** Channel / Volume nav buttons in a side-by-side row */
    private JPanel makeRow(JButton left, JButton right) {
        JPanel row = transparent();
        row.setLayout(new GridLayout(1, 2, 10, 0));
        row.setMaximumSize(new Dimension(Integer.MAX_VALUE, 46));
        row.add(left); row.add(right);
        return row;
    }

    private JButton makeNavButton(String label, String tooltip, Color c) {
        JButton btn = new GlowButton(label, c, 14, 20);
        btn.setToolTipText(tooltip);
        btn.setPreferredSize(new Dimension(108, 44));
        return btn;
    }

    /** TV / USB / HDMI row */
    private JPanel makeMediaRow() {
        JPanel row = transparent();
        row.setLayout(new GridLayout(1, 3, 8, 0));
        row.setMaximumSize(new Dimension(Integer.MAX_VALUE, 44));

        String[] labels   = { "📺 TV", "🔌 USB", "🖥 HDMI" };
        Color[]  colors   = { BLUE_BTN, YELLOW_BTN, GREEN_BTN };

        for (int i = 0; i < 3; i++) {
            JButton b = new GlowButton(labels[i], colors[i], 12, 18);
            b.setPreferredSize(new Dimension(72, 40));
            row.add(b);
        }
        return row;
    }

    /** 3 × 3 digit pad (1–9) + back + 0 + ok */
    private JPanel makeNumpad() {
        String[] keys = {"1","2","3","4","5","6","7","8","9","⬅","0","OK"};
        Color[]  cols = {
            NAV_BTN, NAV_BTN, NAV_BTN,
            NAV_BTN, NAV_BTN, NAV_BTN,
            NAV_BTN, NAV_BTN, NAV_BTN,
            new Color(100,60,60), NAV_BTN, new Color(40,100,60)
        };
        JPanel pad = transparent();
        pad.setLayout(new GridLayout(4, 3, 7, 7));
        pad.setMaximumSize(new Dimension(Integer.MAX_VALUE, 170));
        for (int i = 0; i < keys.length; i++) {
            JButton b = new GlowButton(keys[i], cols[i], 13, 18);
            b.setPreferredSize(new Dimension(68, 36));
            pad.add(b);
        }
        return pad;
    }

    private JPanel makeCenteredRow(Component c) {
        JPanel p = transparent();
        p.setLayout(new FlowLayout(FlowLayout.CENTER, 0, 0));
        p.add(c);
        return p;
    }

    private JSeparator makeDivider() {
        JSeparator sep = new JSeparator();
        sep.setForeground(new Color(80, 90, 120, 150));
        sep.setMaximumSize(new Dimension(Integer.MAX_VALUE, 2));
        return sep;
    }

    private JLabel sectionLabel(String text) {
        JLabel lbl = new JLabel(text, SwingConstants.CENTER);
        lbl.setFont(new Font("Segoe UI", Font.BOLD, 10));
        lbl.setForeground(TEXT_DIM);
        lbl.setAlignmentX(CENTER_ALIGNMENT);
        lbl.setMaximumSize(new Dimension(Integer.MAX_VALUE, 18));
        return lbl;
    }

    private JPanel transparent() {
        JPanel p = new JPanel();
        p.setOpaque(false);
        return p;
    }

    // ════════════════════════════════════════════════════════════════
    //  Custom Painted Components
    // ════════════════════════════════════════════════════════════════

    /** The main remote body – rounded, gradient */
    class RemoteBody extends JPanel {
        RemoteBody() { setOpaque(false); }
        @Override protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            // Body gradient
            GradientPaint gp = new GradientPaint(0, 0, BODY_TOP, 0, getHeight(), BODY_BOTTOM);
            g2.setPaint(gp);
            g2.fillRoundRect(0, 0, getWidth(), getHeight(), 40, 40);
            // Subtle bright edge at top
            g2.setColor(new Color(255, 255, 255, 18));
            g2.setStroke(new BasicStroke(1.5f));
            g2.drawRoundRect(1, 1, getWidth()-2, getHeight()-2, 40, 40);
            g2.dispose();
            super.paintComponent(g);
        }
    }

    /** Solid rounded fill panel */
    static class RoundedSolid extends JPanel {
        private final int arc; private final Color fill;
        RoundedSolid(int arc, Color fill) { this.arc=arc; this.fill=fill; setOpaque(false); }
        @Override protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D)g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2.setColor(fill); g2.fillRoundRect(0,0,getWidth(),getHeight(),arc,arc);
            g2.dispose(); super.paintComponent(g);
        }
    }

    /** Gradient background */
    static class GradientBg extends JPanel {
        private final Color a, b;
        GradientBg(Color a, Color b) { this.a=a; this.b=b; }
        @Override protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D)g; 
            g2.setPaint(new GradientPaint(0,0,a,0,getHeight(),b));
            g2.fillRect(0,0,getWidth(),getHeight());
        }
    }

    /** Button with glow halo */
    static class GlowButton extends JButton {
        private final Color base;
        GlowButton(String txt, Color base, int fontSize, int arc) {
            super(txt);
            this.base = base;
            setFont(new Font("Segoe UI", Font.BOLD, fontSize));
            setForeground(Color.WHITE);
            setFocusPainted(false); setBorderPainted(false); setContentAreaFilled(false);
            setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
            putClientProperty("arc", arc);
        }
        @Override protected void paintComponent(Graphics g) {
            int arc = (int) getClientProperty("arc");
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            // Glow shadow
            g2.setColor(new Color(base.getRed(), base.getGreen(), base.getBlue(), 60));
            g2.fillRoundRect(2, 4, getWidth()-4, getHeight()-2, arc, arc);
            // Button body gradient
            GradientPaint gp = new GradientPaint(0,0,base.brighter(),0,getHeight(),base.darker());
            g2.setPaint(gp);
            g2.fillRoundRect(0, 0, getWidth(), getHeight()-3, arc, arc);
            g2.dispose();
            super.paintComponent(g);
        }
    }

    public static void main(String[] args) {
        try { UIManager.setLookAndFeel(UIManager.getCrossPlatformLookAndFeelClassName()); }
        catch (Exception ignored) {}
        SwingUtilities.invokeLater(Q2_TVRemote::new);
    }
}
