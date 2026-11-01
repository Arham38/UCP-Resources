package pages;

import config.ConfigReader;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class LoginPage {
    WebDriver driver;

    // Locate the email input field using @FindBy
    @FindBy(id = "email")
    public WebElement emailField;

    // Locate the password input field using @FindBy
    @FindBy(id = "passwd")
    public WebElement passwordField;

    // Locate the login button using @FindBy
    @FindBy(id = "SubmitLogin")
    public WebElement loginButton;

    // Constructor to initialize WebElements
    public LoginPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this); // Initialize WebElements using PageFactory
    }

    // Method to perform login must be written in testcase
    public void login(String email, String password){
        emailField.sendKeys(email);
        passwordField.sendKeys(password);
        loginButton.click();
    }
}
