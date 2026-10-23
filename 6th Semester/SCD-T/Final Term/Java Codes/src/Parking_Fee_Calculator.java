//import javax.swing.*;
//import java.awt.*;
//import java.awt.event.ActionEvent;
//import java.awt.event.ActionListener;
//
//public class Parking_Fee_Calculator extends JFrame implements ActionListener {
//    JLabel hoursLabel,feeLabel;
//    JTextField hoursInput,feeOutPut;
//    JButton generateButton,resetButton;
//
//    public Parking_Fee_Calculator(){
//        setTitle("Parking Fee Calculator");
//        setSize(500,300);
//        setLayout(new FlowLayout());
//        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
//
//        hoursLabel=new JLabel("Enter Parking Hours:");
//        hoursInput=new JTextField(10);
//        feeLabel=new JLabel("Total Fee (RS):");
//        feeOutPut=new JTextField(10);
//        feeOutPut.setEditable(false);
//        generateButton=new JButton("Generate Fee");
//        resetButton=new JButton(" Reset");
//
//        generateButton.addActionListener(this);
//        resetButton.addActionListener(this);
//
//
//        add(hoursLabel);
//        add(hoursInput);
//        add(feeLabel);
//        add(feeOutPut);
//        add(generateButton);
//        add(resetButton);
//
//        setVisible(true);
//    }
//
//    @Override
//    public void actionPerformed(ActionEvent e) {
//
//
//        if (e.getSource()==generateButton){
//            String inputText=hoursInput.getText();
//            try{
//                if (inputText.isEmpty()){
//                    JOptionPane.showMessageDialog(this,"Please Enter Parking Hours");
//                    return;
//                }
//                int hours=Integer.parseInt(inputText);
//                int fee;
//                if (hours<=3){
//                    fee=hours*50;
//                }else {
//                    fee=hours*80;
//                }
//                feeOutPut.setText("Rs. "+fee);
//            } catch (NumberFormatException ex) {
//                JOptionPane.showMessageDialog(this,"Enter Hours Correctly");
//            }finally {
//                JOptionPane.showMessageDialog(this,"Fee Generated SuccessFully");
//            }
//        } else if (e.getSource()==resetButton) {
//            hoursInput.setText("");
//            feeOutPut.setText("");
//        }
//
//
//    }
//
//
//    public static void main(String[] args) {
//        new Parking_Fee_Calculator();
//    }
//
//
//}
