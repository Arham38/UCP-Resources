import java.util.ArrayList;
import java.util.List;

class Printer{

    private static Printer instance;
    List<String> userList=new ArrayList<>();
    private Printer(){
        System.out.println("Printer is active..");
    }
    public  static Printer getInstance(){
        if (instance==null) {
            instance = new Printer();
        }
        return instance;
    }

    public void usePrinter(String user){
        userList.add(user);
    }
    public void print(){
        System.out.println(" Printer Start Printing..");
        for (String user:userList){
            System.out.println(user+" document printing..");
        }
    }
}
public class Singleton {
    static void main() {
        Printer user=Printer.getInstance();
        user.usePrinter("User1");
        user.usePrinter("User2");
        user.usePrinter("User3");
        user.usePrinter("User4");
        user.print();
    }
}
