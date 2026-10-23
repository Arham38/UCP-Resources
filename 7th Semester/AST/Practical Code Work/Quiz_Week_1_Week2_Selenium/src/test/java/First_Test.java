import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.WindowType;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class First_Test {
    WebDriver driver;
    @BeforeClass
    public void open_browser() throws InterruptedException {
        driver=new ChromeDriver();
        Thread.sleep(2000);
        driver.manage().window().maximize();// jab tab open hona tab full window
        Thread.sleep(3000);
//        driver.manage().window().minimize();// jab new tab hona tu minimize window
//        Thread.sleep(4000);
//        driver.close();
    }

//    @Test
//    public void testcase() throws InterruptedException {
//        driver.get("https://bonigarcia.dev/selenium-webdriver-java/web-form.html");
//        Thread.sleep(4000);

//        System.out.println("Title: "+driver.getTitle());
//        System.out.println("URL: "+driver.getCurrentUrl());


//        Navigation

//        driver.navigate().to("https://bonigarcia.dev/selenium-webdriver-java/navigation1.html");
//        Thread.sleep(3000);
//        driver.navigate().refresh();
//        Thread.sleep(2000);
//        driver.navigate().back();

//        Switching
//        String original=driver.getWindowHandle();
//        driver.switchTo().newWindow(WindowType.TAB);
//        Thread.sleep(2000);
//        driver.get("https://bonigarcia.dev/selenium-webdriver-java/navigation1.html");
//        Thread.sleep(2000);
//        driver.close();
//        Thread.sleep(2000);
//        driver.switchTo().window(original);

//        Thread.sleep(2000);
//        driver.manage().window().minimize();
//
//        Thread.sleep(2000);
//        driver.manage().window().maximize();
//    }

    @Test
    public void testcase2() throws InterruptedException {
//        driver.get("https://bonigarcia.dev/selenium-webdriver-java/web-form.html");
//        Thread.sleep(2000);
//        WebElement nameInput=driver.findElement(By.id("my-text-id"));
//        nameInput.sendKeys("Muhammad Arham");
//        Thread.sleep(2000);
//        WebElement passwordInput=driver.findElement(By.name("my-password"));
//        passwordInput.sendKeys("12345678");
//        Thread.sleep(2000);
//        WebElement textAreaInput=driver.findElement(By.name("my-textarea"));
//        textAreaInput.sendKeys("Hello! I am Muhammad Arham Bhatti and i'm a software Engineering Student");
//        Thread.sleep(2000);
//        WebElement selectMenu=driver.findElement(By.name("my-select"));
//        selectMenu.sendKeys("Two");
//        Thread.sleep(2000);
//        WebElement dataList=driver.findElement(By.name("my-datalist"));
//        dataList.sendKeys("New York");
//        Thread.sleep(2000);
        WebElement submit=driver.findElement(By.linkText("Products"));

//        Thread.sleep(2000);
//        submit.submit();
//        Thread.sleep(2000);

        driver.get("http://automationexercise.com");

    }
    @AfterClass
    public void teardown(){
        driver.quit();
    }
}
