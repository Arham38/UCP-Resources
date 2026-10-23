import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Filess {
    static void main() throws FileNotFoundException {
        try{
       File file=new File("data.txt");
       Scanner input=new Scanner(file);
       String result = "";
       while (input.hasNextLine()){
           result=input.next();
       }
            System.out.println(result);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
