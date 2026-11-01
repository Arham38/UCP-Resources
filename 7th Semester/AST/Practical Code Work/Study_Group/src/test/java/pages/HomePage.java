package pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class HomePage {
    WebDriver driver;

    // Locate the search box using @FindBy
    @FindBy(id = "search_query_top")
    public WebElement searchBox;

    // Locate the search button using @FindBy
    @FindBy(name = "submit_search")
    public WebElement searchButton;

    // Constructor to initialize WebElements
    public HomePage(WebDriver driver) {
        this.driver = driver;
        // initElements initializes all @FindBy-annotated fields in this class
        PageFactory.initElements(driver, this);
    }

    /* Perform a search operation. It shall be used only if some method is repeatedly required for some testcases of page. MUST not be used for the steps that are part of some actual testcase. For that scenario you can keep the element ‘public’ */
    public void search(String query) {
        searchBox.sendKeys(query);
        searchButton.click();
    }
}
