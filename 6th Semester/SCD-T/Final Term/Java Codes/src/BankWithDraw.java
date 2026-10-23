import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class InsufficientFundsException extends Exception {

    private double amount;

    public InsufficientFundsException(String message, double amount) {
        super(message);
        this.amount = amount;
    }

    public double getAmount() {
        return amount;
    }
}

class BankAccount {

    private double balance = 5000;

    public void withdraw(double amount)
            throws InsufficientFundsException {

        if (amount > balance) {
            throw new InsufficientFundsException(
                    "Insufficient Funds!", amount);
        }

        balance -= amount;
        System.out.println("Withdrawal Successful");
    }
}

public class Main {

    private static final Logger logger =
            LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) {

        BankAccount account = new BankAccount();

        try {

            logger.info("Withdrawal request started.");

            account.withdraw(6000);

        } catch (InsufficientFundsException e) {

            logger.error("Withdrawal Failed.");

            System.out.println(e.getMessage());
            System.out.println("Requested Amount: " + e.getAmount());

        } finally {

            System.out.println("Transaction Completed.");
        }
    }
}