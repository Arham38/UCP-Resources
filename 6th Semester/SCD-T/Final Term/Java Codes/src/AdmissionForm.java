import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

class Form {

}

public class AdmissionForm {

    public static void main(String[] args) {

        JFrame frame = new JFrame("Admission Form");
        frame.setSize(500, 400);
        frame.setLayout(null);

        // Labels
        JLabel firstName = new JLabel("First Name:");
        firstName.setBounds(40, 40, 100, 30);

        JLabel lastName = new JLabel("Last Name:");
        lastName.setBounds(40, 90, 100, 30);

        JLabel age = new JLabel("Age:");
        age.setBounds(40, 140, 100, 30);

        JLabel marks = new JLabel("Marks:");
        marks.setBounds(40, 190, 100, 30);

        JLabel result=new JLabel("Result:");
        result.setBounds(40, 240, 100, 30);


        // Text Fields
        JTextField firstNameTextField = new JTextField();
        firstNameTextField.setBounds(150, 40, 180, 30);

        JTextField lastNameTextField = new JTextField();
        lastNameTextField.setBounds(150, 90, 180, 30);

        JTextField ageTextField = new JTextField();
        ageTextField.setBounds(150, 140, 180, 30);

        JTextField marksTextField = new JTextField();
        marksTextField.setBounds(150, 190, 180, 30);

        JTextField resultTextField = new JTextField();
        resultTextField.setBounds(150, 240, 180, 30);
        resultTextField.setEditable(false);


        // Buttons
        // Buttons
        JButton checkButton = new JButton("Check");
        checkButton.setBounds(70, 290, 100, 35);

        JButton resetButton = new JButton("Reset");
        resetButton.setBounds(210, 290, 100, 35);


        // Event Handling
//        Check Result
        checkButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {

                String firstName = firstNameTextField.getText();
                String lastName = lastNameTextField.getText();
                String age = ageTextField.getText();
                String marks = marksTextField.getText();

                if (
                        firstName.isEmpty() ||
                                lastName.isEmpty() ||
                                age.isEmpty() ||
                                marks.isEmpty()
                ) {

                    JOptionPane.showMessageDialog(frame, "Please fill all fields");

                } else {

                    int studentAge = Integer.parseInt(age);
                    int studentMarks = Integer.parseInt(marks);

                    if (studentMarks>=55){
                        resultTextField.setText(firstNameTextField.getText()+" "+lastNameTextField.getText()+" is Eligible\nFor Admission");
                    }else {
                        resultTextField.setText(firstNameTextField.getText()+" "+lastNameTextField.getText()+" is Not Eligible\nFor Admission");
                    }
                    JOptionPane.showMessageDialog(frame, "Form Submitted");

                }
            }
        });


        // Reset
        resetButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                firstNameTextField.setText("");
                lastNameTextField.setText("");
                ageTextField.setText("");
                marksTextField.setText("");
                resultTextField.setText("");
            }
        });

        // Add Components
        frame.add(firstName);
        frame.add(lastName);
        frame.add(age);
        frame.add(marks);
        frame.add(result);

        frame.add(firstNameTextField);
        frame.add(lastNameTextField);
        frame.add(ageTextField);
        frame.add(marksTextField);
        frame.add(resultTextField);
        frame.add(checkButton);
        frame.add(resetButton);

        // Frame Settings
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);
    }
}