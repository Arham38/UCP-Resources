package com.expensesplitter.views;

import com.expensesplitter.utils.SessionManager;
import com.expensesplitter.utils.StyleConstants;
import com.expensesplitter.models.User;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Parent;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;

/**
 * Main dashboard screen for the AI-Powered Expense Splitter application.
 * Built entirely with pure JavaFX code (no FXML).
 * Extends BorderPane to provide a structured layout with sidebar navigation.
 *
 * Layout Structure:
 * ─────────────────────────────────────────────────────────────────────
 * Left Sidebar (VBox, width 220, SIDEBAR_STYLE):
 *   - App title at top
 *   - Navigation buttons (Dashboard, Groups, Add Expense, Settlements, Analytics, Search)
 *   - Logout button at bottom
 * Top Bar (HBox, TOPBAR_STYLE):
 *   - Screen title on left, welcome message with username on right
 * Center (StackPane):
 *   - Content area that displays different screens
 * ─────────────────────────────────────────────────────────────────────
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.views
 */
public class DashboardScreen extends BorderPane {

    /** UI Components - Sidebar */
    private VBox sidebar;
    private Label appTitleLabel;
    private Button dashboardButton;
    private Button groupsButton;
    private Button addExpenseButton;
    private Button settlementsButton;
    private Button analyticsButton;
    private Button searchButton;
    private Button logoutButton;

    /** UI Components - Top Bar */
    private HBox topBar;
    private Label screenTitleLabel;
    private Label welcomeLabel;

    /** UI Components - Content Area */
    private StackPane contentArea;

    /** Currently logged-in user from session */
    private User currentUser;

    /** Currently active navigation button */
    private Button activeButton;

    /**
     * Constructor - builds the entire dashboard UI programmatically.
     * Initializes sidebar, top bar, content area, and shows welcome card by default.
     */
    public DashboardScreen() {
        this.currentUser = SessionManager.getCurrentUser();

        setMinSize(1000, 650);
        setStyle("-fx-background-color: " + StyleConstants.SECONDARY_COLOR + ";");

        // Build layout regions
        this.setLeft(createSidebar());
        this.setTop(createTopBar());
        this.setCenter(createContentArea());

        // Show welcome card as default center content
        showWelcomeView();
    }

    /**
     * Creates the left sidebar with navigation buttons.
     * Dark background (#2C3E50) with white text, width 220px.
     *
     * @return VBox containing the sidebar
     */
    private VBox createSidebar() {
        sidebar = new VBox(0);
        sidebar.setStyle(StyleConstants.SIDEBAR_STYLE);
        sidebar.setPrefWidth(220);
        sidebar.setMinWidth(220);
        sidebar.setMaxWidth(220);
        sidebar.setAlignment(Pos.TOP_CENTER);

        // App title at top with emoji
        VBox titleBox = new VBox(5);
        titleBox.setAlignment(Pos.CENTER);
        titleBox.setPadding(new Insets(20, 0, 20, 0));
        Label emojiLabel = new Label("💰");
        emojiLabel.setFont(Font.font("Arial", 24));
        appTitleLabel = new Label("Expense\nSplitter");
        appTitleLabel.setFont(Font.font("Arial", FontWeight.BOLD, 16));
        appTitleLabel.setTextFill(Color.WHITE);
        appTitleLabel.setStyle("-fx-text-alignment: CENTER; -fx-line-spacing: 2;");
        titleBox.getChildren().addAll(emojiLabel, appTitleLabel);

        // Navigation buttons — each routes to the correct screen
        dashboardButton = createNavButton("📊 Dashboard");
        dashboardButton.setOnAction(e -> handleNavigation(dashboardButton, "Dashboard", this::showWelcomeView));

        groupsButton = createNavButton("👥 Groups");
        groupsButton.setOnAction(e -> handleNavigation(groupsButton, "Groups", () -> navigateTo(new GroupScreen())));

        addExpenseButton = createNavButton("➕ Add Expense");
        addExpenseButton.setOnAction(e -> handleNavigation(addExpenseButton, "Add Expense", () -> navigateTo(new AddExpenseScreen())));

        settlementsButton = createNavButton("💸 Settlements");
        settlementsButton.setOnAction(e -> handleNavigation(settlementsButton, "Settlements", () -> navigateTo(new SettlementScreen())));

        analyticsButton = createNavButton("📈 Analytics");
        analyticsButton.setOnAction(e -> handleNavigation(analyticsButton, "Analytics", () -> navigateTo(new AnalyticsScreen())));

        searchButton = createNavButton("🔍 Search");
        searchButton.setOnAction(e -> handleNavigation(searchButton, "Search", () -> navigateTo(new SearchScreen())));

        // Spacer pushes logout button to the bottom of the sidebar
        VBox spacer = new VBox();
        VBox.setVgrow(spacer, javafx.scene.layout.Priority.ALWAYS);

        // Logout button at bottom
        logoutButton = new Button("Logout");
        logoutButton.setStyle(StyleConstants.BTN_DANGER_STYLE);
        logoutButton.setMaxWidth(Double.MAX_VALUE);
        logoutButton.setPadding(new Insets(14, 20, 14, 20));
        logoutButton.setOnAction(e -> handleLogout());
        StyleConstants.applyDangerHover(logoutButton);

        // Assemble sidebar components
        sidebar.getChildren().addAll(
                titleBox,
                dashboardButton,
                groupsButton,
                addExpenseButton,
                settlementsButton,
                analyticsButton,
                searchButton,
                spacer,
                logoutButton
        );

        // Dashboard is active by default on first load
        setActiveButton(dashboardButton);

        return sidebar;
    }

    /**
     * Creates a navigation button with consistent sidebar styling and hover effects.
     *
     * @param text the button label text
     * @return styled Button ready for sidebar use
     */
    private Button createNavButton(String text) {
        Button button = new Button(text);
        button.setStyle(StyleConstants.SIDEBAR_BTN_STYLE);
        button.setMaxWidth(Double.MAX_VALUE);

        // Hover effect — only apply when button is not currently active
        button.setOnMouseEntered(e -> {
            if (button != activeButton) {
                button.setStyle(StyleConstants.SIDEBAR_BTN_HOVER);
            }
        });
        button.setOnMouseExited(e -> {
            if (button != activeButton) {
                button.setStyle(StyleConstants.SIDEBAR_BTN_STYLE);
            }
        });

        return button;
    }

    /**
     * Sets the active button styling and resets all other buttons to default style.
     * Only one sidebar button is active at a time.
     *
     * @param button the button to mark as active
     */
    private void setActiveButton(Button button) {
        // Reset all buttons to default transparent style
        dashboardButton.setStyle(StyleConstants.SIDEBAR_BTN_STYLE);
        groupsButton.setStyle(StyleConstants.SIDEBAR_BTN_STYLE);
        addExpenseButton.setStyle(StyleConstants.SIDEBAR_BTN_STYLE);
        settlementsButton.setStyle(StyleConstants.SIDEBAR_BTN_STYLE);
        analyticsButton.setStyle(StyleConstants.SIDEBAR_BTN_STYLE);
        searchButton.setStyle(StyleConstants.SIDEBAR_BTN_STYLE);

        // Apply active blue highlight to the selected button
        button.setStyle(StyleConstants.SIDEBAR_BTN_ACTIVE);
        activeButton = button;
    }

    /**
     * Handles sidebar navigation button clicks.
     * Updates active button style, top bar title, and loads the target screen.
     *
     * @param button     the button that was clicked
     * @param screenName the display name shown in the top bar
     * @param action     the navigation action to execute
     */
    private void handleNavigation(Button button, String screenName, Runnable action) {
        setActiveButton(button);
        screenTitleLabel.setText(screenName);
        action.run();
    }

    /**
     * Creates the top bar with screen title and welcome message.
     *
     * @return HBox containing the top bar
     */
    private HBox createTopBar() {
        topBar = new HBox(20);
        topBar.setStyle(StyleConstants.TOPBAR_STYLE);
        topBar.setAlignment(Pos.CENTER_LEFT);
        topBar.setPadding(new Insets(12, 20, 12, 20));

        // Screen title label on the left
        screenTitleLabel = new Label("Dashboard");
        screenTitleLabel.setFont(Font.font("Arial", FontWeight.BOLD, 16));
        screenTitleLabel.setTextFill(Color.web(StyleConstants.TEXT_PRIMARY));

        // Spacer pushes welcome label to the right
        HBox spacer = new HBox();
        HBox.setHgrow(spacer, javafx.scene.layout.Priority.ALWAYS);

        // Welcome label shows logged-in user's name from session
        String username = currentUser != null ? currentUser.getName() : "User";
        welcomeLabel = new Label("👤 Welcome, " + username + "!");
        welcomeLabel.setFont(Font.font("Arial", 13));
        welcomeLabel.setTextFill(Color.web(StyleConstants.TEXT_SECONDARY));

        topBar.getChildren().addAll(screenTitleLabel, spacer, welcomeLabel);

        return topBar;
    }

    /**
     * Creates the center content area as a StackPane.
     * Child screens are swapped in and out of this area.
     *
     * @return StackPane for content display
     */
    private StackPane createContentArea() {
        contentArea = new StackPane();
        contentArea.setStyle("-fx-background-color: " + StyleConstants.SECONDARY_COLOR + ";");
        return contentArea;
    }

    /**
     * Replaces the center content area with the given screen.
     *
     * @param screen the Parent layout of the screen to display
     */
    private void navigateTo(Parent screen) {
        contentArea.getChildren().clear();
        contentArea.getChildren().add(screen);
    }

    /**
     * Shows the default welcome card in the center content area.
     */
    private void showWelcomeView() {
        VBox welcomeCard = new VBox(16);
        welcomeCard.setStyle(StyleConstants.CARD_STYLE);
        welcomeCard.setAlignment(Pos.CENTER);
        welcomeCard.setMaxWidth(500);

        String name = currentUser != null ? currentUser.getName() : "User";
        Label welcomeTitle = new Label("Welcome back, " + name + "! 👋");
        welcomeTitle.setStyle(StyleConstants.HEADING_STYLE);

        Label welcomeMessage = new Label("Select a module from the sidebar to get started.");
        welcomeMessage.setStyle(StyleConstants.SUBHEADING_STYLE);

        welcomeCard.getChildren().addAll(welcomeTitle, welcomeMessage);
        navigateTo(welcomeCard);
    }

    /**
     * Handles logout — clears session and navigates back to LoginView.
     */
    private void handleLogout() {
        try {
            SessionManager.clearSession();
            System.out.println("Session cleared. User logged out.");

            resetSidebarButtons();
            activeButton = null;

            ScreenNavigator.navigateTo(new LoginScreen(), MainApp.APP_TITLE);

        } catch (Exception e) {
            System.err.println("Error during logout: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Resets all sidebar navigation buttons to default style on logout.
     */
    private void resetSidebarButtons() {
        dashboardButton.setStyle(StyleConstants.SIDEBAR_BTN_STYLE);
        groupsButton.setStyle(StyleConstants.SIDEBAR_BTN_STYLE);
        addExpenseButton.setStyle(StyleConstants.SIDEBAR_BTN_STYLE);
        settlementsButton.setStyle(StyleConstants.SIDEBAR_BTN_STYLE);
        analyticsButton.setStyle(StyleConstants.SIDEBAR_BTN_STYLE);
        searchButton.setStyle(StyleConstants.SIDEBAR_BTN_STYLE);
    }
}
