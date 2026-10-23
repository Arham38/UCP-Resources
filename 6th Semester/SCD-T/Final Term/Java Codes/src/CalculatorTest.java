import static org.junit.Assert.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
// Junit 4
public class CalculatorTest {
    Calculator calculator;
    @Before
    public void testStart(){
        calculator=new Calculator();
        System.out.println("Test Start");}
    @Test
    public void testSubtract(){
        assertEquals(-1,calculator.subtract(1,2));}
    @Test
    public void testDivision(){
        assertEquals(2,calculator.division(4,2));}
    @Test
    public void testAdd(){
        assertEquals(3,calculator.add(1,2));}
    @Test
    public void testException(){
        assertThrows(ArithmeticException.class,()->calculator.division(10,0));}
    @Test
    public void checkAge(){
        assertTrue(calculator.checkAge(19));
    }
    @After
    public void testEnd(){
        System.out.println("Test End");}

    static void main(String[] args) {
    }
}
