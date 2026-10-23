import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.Test;

public class L1F23BSSE0372 {

    @Test
    public void openBrowser() throws InterruptedException {
        // 1. Launch browser and open my chosen website
        WebDriver driver = new ChromeDriver();
        driver.get("https://www.kisankapakistan.com.pk/");

        // Save the first window handle to come back later
        String firstWindow = driver.getWindowHandle();

        // 2. Set window position using last two digits of my ID (72) and read it back
        driver.manage().window().setPosition(new Point(7, 2));
        Thread.sleep(2000);
        Point readPosition = driver.manage().window().getPosition();
        System.out.println("X: " + readPosition.getX() + ", Y: " + readPosition.getY());
        Thread.sleep(3000);

        driver.manage().window().maximize();

        // 3. Click Mandi Rates link using CSS selector (direct child > and descendant space)
        driver.findElement(By.cssSelector("div>header a[href]:nth-child(2)")).click();
        Thread.sleep(3000);

        // Locate search box using XPath and type text
        WebElement search = driver.findElement(By.xpath("//div[@class='relative']//input[contains(@placeholder,\"Search by crop\")]"));
        search.sendKeys("Potato");

        // 6. Assertion: check that the search box really contains the typed value
        String searchInput = search.getAttribute("value");
        Assert.assertEquals(searchInput, "Potato", "Input does not matched");
        Thread.sleep(2000);

        driver.manage().window().fullscreen();
        Thread.sleep(2000);

        // Open contact section in a new tab because the message box is there
        driver.switchTo().newWindow(WindowType.TAB);
        driver.get("https://www.kisankapakistan.com.pk/#contact-section");
        Thread.sleep(2000);

        // 4 and 5. XPath with // (descendant) and / (direct child), then enter 40+ words
        String understanding = "In this Automated Software Testing course, "
                + "I learned how to test web applications automatically instead of "
                + "checking everything manually. I started with Katalon Recorder, "
                + "then moved to Selenium WebDriver with Maven and Java. "
                + "I understand locators like ID, CSS selector and XPath, "
                + "and commands like click and sendKeys. I am still practicing "
                + "writing reliable selectors for complex pages.";

        driver.findElement(By.xpath("//form//div/textarea[contains(@placeholder,\"Tell us about your shop, crop, or requirements...\")]")).sendKeys(understanding);
        Thread.sleep(2000);

        // 7. Open a new browser window with a different website and print its title
        driver.switchTo().newWindow(WindowType.WINDOW);
        Thread.sleep(2000);
        driver.navigate().to("https://punjab.gov.pk/cm-kissan-card-schem");
        Thread.sleep(2000);
        System.out.println("Page Title: " + driver.getTitle());
        Thread.sleep(2000);

        // 8. Switch back to the first window and print its title
        driver.switchTo().window(firstWindow);
        System.out.println("Back on first window: " + driver.getTitle());

        // 9. Wait for 5 seconds
        Thread.sleep(5000);

        // 10. Close the browser
        driver.quit();
    }
}