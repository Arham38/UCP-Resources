// Custom Exception OR User Defined Exception

class InvalidAgeException extends Exception{
    public InvalidAgeException(String message){
        super(message);
    }
}
public class Exception_Handling {

    public static void validateAge(int age) throws InvalidAgeException{
        if (age<18){
            throw new InvalidAgeException("Age must be above 18");
        }
        System.out.println("Valid Age");
    }
    public static void main(String[] args) {
        try
        {
            validateAge(18);
        } catch (InvalidAgeException e) {
            System.out.println(e.getMessage());
        }
    }
}