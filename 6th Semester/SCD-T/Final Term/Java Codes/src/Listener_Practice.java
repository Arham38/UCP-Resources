import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class Listener_Practice extends JFrame implements ActionListener , MouseListener , KeyListener {

    JButton submit;
    JTextField input,input2;
    JLabel name,email;

    public Listener_Practice(){
        setTitle("Listener Working");
        setSize(450,500);
        setLayout(new FlowLayout());
        setDefaultCloseOperation(EXIT_ON_CLOSE);

        name=new JLabel("Name: ");
        input=new JTextField(10);

        email=new JLabel("Email: ");
        input2=new JTextField(10);

        submit=new JButton("Submit");

        submit.addActionListener(this);

        input.addMouseListener(this);

        input2.addKeyListener(this);

        add(name);
        add(input);
        add(email);
        add(input2);
        add(submit);
    }

    public void actionPerformed(ActionEvent e) {
        if (e.getSource()==submit){
            JOptionPane.showMessageDialog(this,"Welcome "+input.getText());
        }

    }

//    Mouse Listner


    @Override
    public void mouseClicked(MouseEvent e) {
        System.out.println("Mouse Clicked");
    }

    @Override
    public void mousePressed(MouseEvent e) {
        System.out.println("Mouse Pressed");
    }

    @Override
    public void mouseReleased(MouseEvent e) {
        System.out.println("Mouse Released");
    }

    @Override
    public void mouseEntered(MouseEvent e) {
        System.out.println("Mouse Entered");
    }

    @Override
    public void mouseExited(MouseEvent e) {
        System.out.println("Mouse Exited");
    }


    // Key Listener
    @Override
    public void keyTyped(KeyEvent e) {
        System.out.println("Key Typed");
    }

    @Override
    public void keyPressed(KeyEvent e) {
        System.out.println("Key Pressed");
    }

    @Override
    public void keyReleased(KeyEvent e) {
        System.out.println("Key Released");
    }


    public static void main(String[] args) {
        new Listener_Practice().setVisible(true);
    }


}
