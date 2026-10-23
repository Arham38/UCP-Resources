public class Calculator_Cp {
    static int add(int a, int b) {
        return a + b;
    }

//    Red Phase - Tests
    static void testAddPositiveNumbers() {
        int result = add(3, 5);
        if (result == 8) {
            System.out.println("Test 1 - Add Positive Numbers : PASS ");
        } else {
            System.out.println("Test 1 - Add Positive Numbers : FAIL Expected 8 but got " + result);
        }
    }

    static void testAddWithZero() {
        int result = add(0, 7);
        if (result == 7) {
            System.out.println("Test 2 - Add With Zero        : PASS");
        } else {
            System.out.println("Test 2 - Add With Zero        : FAIL Expected 7 but got " + result);
        }
    }

    static void testAddNegativeNumbers() {
        int result = add(-2, -3);
        if (result == -5) {
            System.out.println("Test 3 - Add Negative Numbers : PASS ");
        } else {
            System.out.println("Test 3 - Add Negative Numbers : FAIL Expected -5 but got " + result);
        }
    }

    static void testAddMixedNumbers() {
        int result = add(-3, 7);
        if (result == 4) {
            System.out.println("Test 4 - Add Mixed Numbers    : PASS ");
        } else {
            System.out.println("Test 4 - Add Mixed Numbers    : FAIL Expected 4 but got " + result);
        }
    }

    public static void main(String[] args) {


        System.out.println("   TDD - Simple Calculator    ");


        testAddPositiveNumbers();
        testAddWithZero();
        testAddNegativeNumbers();
        testAddMixedNumbers();


        System.out.println("      All Tests Completed     ");

    }
}