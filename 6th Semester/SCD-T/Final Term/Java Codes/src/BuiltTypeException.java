import java.util.Scanner;

// Built Type Exceptions

public class BuiltTypeException {

    // Number Format Exception

   public static void main(String[] args) {
        Scanner input=new Scanner(System.in);
        try
        {
            System.out.print("Enter String: ");
            String string=input.next();

            int number=Integer.parseInt(string);

            System.out.println("Original String: "+string);

            System.out.println("Converted String To Integer: "+number);

        } catch (NumberFormatException e) {
            System.out.println("Invalid Number Input");
        }
    }
}