public class BankAccount_Cp {

    // Bank Account Logic
    private double balance;

    // Constructor
    public BankAccount_Cp(double initialBalance) {
        this.balance = initialBalance;
    }

    // Deposit Method
    public double deposit(double amount) {
        balance += amount;
        return balance;
    }

    // Withdraw Method
    public double withdraw(double amount) {
        if (amount > balance) {
            System.out.println("Insufficient funds!");
            return balance;
        }
        balance -= amount;
        return balance;
    }

    // Get Balance Method
    public double getBalance() {
        return balance;
    }

    // @Before - Setup (runs before each test)
    static BankAccount_Cp setUp() {
        return new BankAccount_Cp(1000.0);
    }

    // Test 1: Normal Case - Deposit Amount
    static void testDeposit() {
        // Arrange
        BankAccount_Cp account = setUp();
        // Act
        double result = account.deposit(500.0);
        // Assert
        System.out.println("Test 1 - Deposit Amount       : " + (result == 1500.0 ? "PASS " : "FAIL "));
    }

    // Test 2: Normal Case - Withdraw Amount
    static void testWithdraw() {
        // Arrange
        BankAccount_Cp account = setUp();
        // Act
        double result = account.withdraw(200.0);
        // Assert
        System.out.println("Test 2 - Withdraw Amount      : " + (result == 800.0 ? "PASS " : "FAIL "));
    }

    // Test 3: Edge Case - Withdraw Exact Balance
    static void testWithdrawExactBalance() {
        // Arrange
        BankAccount_Cp account = setUp();
        // Act
        double result = account.withdraw(1000.0);
        // Assert
        System.out.println("Test 3 - Withdraw Exact Bal   : " + (result == 0.0 ? "PASS " : "FAIL "));
    }

    // Test 4: Invalid Case - Withdraw More Than Balance
    static void testWithdrawInsufficientFunds() {
        // Arrange
        BankAccount_Cp account = setUp();
        // Act
        double result = account.withdraw(5000.0);
        // Assert
        System.out.println("Test 4 - Insufficient Funds   : " + (result == 1000.0 ? "PASS " : "FAIL "));
    }

    // Test 5: Edge Case - Check Balance
    static void testGetBalance() {
        // Arrange
        BankAccount_Cp account = setUp();
        // Act
        double result = account.getBalance();
        // Assert
        System.out.println("Test 5 - Check Balance        : " + (result == 1000.0 ? "PASS " : "FAIL "));
    }

    public static void main(String[] args) {

        System.out.println("   TDD - Bank Account System  ");

        testDeposit();
        testWithdraw();
        testWithdrawExactBalance();
        testWithdrawInsufficientFunds();
        testGetBalance();


        System.out.println("      All Tests Completed     ");
    }
}