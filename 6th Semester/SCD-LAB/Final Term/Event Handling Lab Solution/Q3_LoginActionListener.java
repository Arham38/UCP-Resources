import javax.swing.*;
import javax.swing.border.*;
import java.awt.*;
import java.awt.event.*;   // ActionListener lives here

/**
 * Q3: Login Form with ActionListener
 * ─────────────────────────────────────────────────────────────────────
 * When the Login button is clicked → ActionListener fires →
 * JOptionPane shows "Login Successful"
 *
 * UI: Dark purple/indigo theme, rounded card, glowing button
 */
public class Q3_LoginActionListener extends JFrame implements ActionListener {

    // ─── Widgets ──────────────────────────────────────────────────────
    private final JTextField     usernameField;
    private final JPasswordField passwordField;
    private final JButton        loginButton;

    // ─── Palette ──────────────────────────────────────────────────────
    private static final Color BG_TOP    = new Color(18, 12, 45);
    private static final Color BG_BOTTOM = new Color(45, 25, 90);
    private static final Color CARD_BG   = new Color(255, 255, 255, 22);
    private static final Color ACCENT    = new Color(149, 97, 255);    // purple
    private static final Color BTN_COLOR = new Color(109, 40, 217);
    private static final Color WHITE     = Color.WHITE;
    private static final Color LABEL_CLR = new Color(200, 180, 255);

    public Q3_LoginActionListener() {
        setTitle("Secure Login — ActionListener Demo");
        setSize(460, 520);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);

        // ── Background ────────────────────────────────────────────────
        JPanel bg = new GradientPanel(BG_TOP, BG_BOTTOM);
        bg.setLayout(new GridBagLayout());
        setContentPane(bg);

        // ── Card ──────────────────────────────────────────────────────
        JPanel card = new RoundedPanel(28, CARD_BG);
        card.setPreferredSize(new Dimension(360, 390));
        card.setLayout(new GridBagLayout());
        card.setBorder(BorderFactory.createEmptyBorder(30, 35, 30, 35));
        GridBagConstraints g = new GridBagConstraints();
        g.gridwidth = GridBagConstraints.REMAINDER;
        g.fill      = GridBagConstraints.HORIZONTAL;

        // Title
        JLabel title = new JLabel("🔑  Secure Login", SwingConstants.CENTER);
        title.setFont(new Font("Segoe UI", Font.BOLD, 24));
        title.setForeground(WHITE);
        g.insets = new Insets(0, 0, 6, 0);
        card.add(title, g);

        // Tagline
        JLabel tag = new JLabel("ActionListener powered authentication", SwingConstants.CENTER);
        tag.setFont(new Font("Segoe UI", Font.ITALIC, 12));
        tag.setForeground(new Color(180, 150, 255));
        g.insets = new Insets(0, 0, 22, 0);
        card.add(tag, g);

        // Username label + field
        card.add(fieldLabel("  👤  Username"), withInset(g, 5, 0, 4, 0));
        usernameField = styledField("Type your username…");
        card.add(usernameField, withInset(g, 0, 0, 14, 0));

        // Password label + field
        card.add(fieldLabel("  🔒  Password"), withInset(g, 5, 0, 4, 0));
        passwordField = new JPasswordField();
        stylePass(passwordField);
        card.add(passwordField, withInset(g, 0, 0, 26, 0));

        // Login button  ← this is where ActionListener is registered
        loginButton = new GlowButton("  LOGIN  →", BTN_COLOR, 15);
        loginButton.setPreferredSize(new Dimension(290, 46));
        loginButton.addActionListener(this);          // ← Q3 requirement
        card.add(loginButton, withInset(g, 0, 0, 14, 0));

        // Hint
        JLabel hint = new JLabel("Click Login to fire the ActionListener", SwingConstants.CENTER);
        hint.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        hint.setForeground(new Color(140, 110, 220));
        g.insets = new Insets(4, 0, 0, 0);
        card.add(hint, g);

        bg.add(card);
        setVisible(true);
    }

    // ════════════════════════════════════════════════════════════════
    //  ACTION LISTENER  (Q3 requirement)
    // ════════════════════════════════════════════════════════════════
    @Override
    public void actionPerformed(ActionEvent e) {
        // This method runs when loginButton is clicked
        if (e.getSource() == loginButton) {
            // Show "Login Successful" via JOptionPane (exactly as Q3 asks)
            JOptionPane.showMessageDialog(
                this,
                "✅  Login Successful!\n\nWelcome, " + usernameField.getText(),
                "Authentication Result",
                JOptionPane.INFORMATION_MESSAGE
            );
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
        tf.setPreferredSize(new Dimension(290, 42));
        tf.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        tf.setForeground(new Color(200, 185, 255));
        tf.setCaretColor(WHITE);
        tf.setOpaque(false);
        tf.setBorder(BorderFactory.createCompoundBorder(
            new RoundedBorder(10, ACCENT),
            BorderFactory.createEmptyBorder(5, 12, 5, 12)
        ));
        return tf;
    }

    private void stylePass(JPasswordField f) {
        f.setPreferredSize(new Dimension(290, 42));
        f.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        f.setForeground(new Color(200, 185, 255));
        f.setCaretColor(WHITE);
        f.setOpaque(false);
        f.setBorder(BorderFactory.createCompoundBorder(
            new RoundedBorder(10, ACCENT),
            BorderFactory.createEmptyBorder(5, 12, 5, 12)
        ));
    }

    private GridBagConstraints withInset(GridBagConstraints base, int t, int l, int b, int r) {
        base.insets = new Insets(t, l, b, r);
        return base;
    }

    // ════════════════════════════════════════════════════════════════
    //  Custom UI Components (reused across all question files)
    // ════════════════════════════════════════════════════════════════

    static class GradientPanel extends JPanel {
        private final Color top, bot;
        GradientPanel(Color top, Color bot) { this.top=top; this.bot=bot; }
        @Override protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D)g;
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
            g2.setColor(new Color(255,255,255,50)); g2.setStroke(new BasicStroke(1.2f));
            g2.drawRoundRect(1,1,getWidth()-2,getHeight()-2,arc,arc);
            g2.dispose(); super.paintComponent(g);
        }
    }

    static class RoundedBorder extends AbstractBorder {
        private final int r; private final Color c;
        RoundedBorder(int r,Color c){this.r=r;this.c=c;}
        @Override public void paintBorder(Component comp,Graphics g,int x,int y,int w,int h){
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
        SwingUtilities.invokeLater(Q3_LoginActionListener::new);
    }
}
