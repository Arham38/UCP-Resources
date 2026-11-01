import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.*;
import org.testng.annotations.Test;
import java.time.Duration;

public class WhatsAppTest {

    @Test
    public void sendWhatsAppMessage() throws InterruptedException {
        WebDriver driver = new ChromeDriver();
        driver.manage().window().maximize();

        // friend ka number country code ke sath, bina + ke (Pakistan = 92)
        String phone = "923401301616";
        String message = "Hello! This message was sent using Selenium automation.";

        // is URL se chat seedha khul jati hai aur message pehle se likha hota hai
        driver.get("https://web.whatsapp.com/send?phone=" + phone
                + "&text=" + message.replace(" ", "%20"));

        // pehli baar QR code phone se scan karna hoga (WhatsApp, phir Linked Devices)
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(90));

        // message box nazar aane tak intezar
        WebElement messageBox = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//footer//div[@contenteditable='true']")));

        Thread.sleep(2000);
        messageBox.sendKeys(Keys.ENTER);   // message send

        Thread.sleep(5000);
        driver.quit();
    }
}