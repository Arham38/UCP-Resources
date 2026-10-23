
public class Calculator {
    public static int add(int a,int b){
        return a+b;
    }
    public static int subtract(int a,int b){
        return a-b;
    }
    public static int division(int a,int b){
        if (b==0){
            System.out.println("Number Can't Divide By Zero");
            return -1;
        }
        return a/b;
    }

  public static boolean checkAge(int age){
        if (age<18){
            return false;
        }
        return true;
  }

    public static void main(String[] args) {
//        int age=checkAge(19);
        System.out.println(checkAge(19));
    }
}
