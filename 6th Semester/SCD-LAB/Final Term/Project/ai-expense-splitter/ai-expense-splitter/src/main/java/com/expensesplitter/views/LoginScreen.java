package com.expensesplitter.views;

import com.expensesplitter.dao.UserDAO;
import com.expensesplitter.models.User;
import com.expensesplitter.utils.InputValidator;
import com.expensesplitter.utils.PasswordHasher;
import com.expensesplitter.utils.SessionManager;
import com.expensesplitter.utils.StyleConstants;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.*;
import javafx.scene.layout.*;

import java.sql.SQLException;

/**
 * Login screen for the AI-Powered Expense Splitter application.
 * Built entirely with pure JavaFX code (no FXML).
 * Centered card layout on a light gray background.
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.views
 */
public class LoginScreen extends BorderPane {

    private TextField emailField;
    private PasswordField passwordField;
    private Label errorLabel;
    private Button loginButton;
    private Hyperlink registerLink;

    private final UserDAO userDAO = new UserDAO();

    /**
     * Constructs the login screen and builds all UI components.
     */
    public LoginScreen() {
        setStyle("-fx-background-color: " + StyleConstants.SECONDARY_COLOR + ";");
        StackPane centerWrapper = new StackPane(createCard());
        setCenter(centerWrapper);
    }

    /**
     * Creates the centered login card (420px wide, 40px padding).
     *
     * @return VBox login card
     */
    private VBox createCard() {
        VBox card = new VBox(16);
        card.setStyle(StyleConstants.CARD_STYLE);
        card.setPadding(new Insets(40));
        card.setMaxWidth(420);
        card.setAlignment(Pos.CENTER);

        VBox header = createHeader();
        VBox form = createForm();

        errorLabel = new Label();
        errorLabel.setStyle(StyleConstants.ERROR_LABEL_STYLE);
        errorLabel.setWrapText(true);
        errorLabel.setAlignment(Pos.CENTER);
        errorLabel.setVisible(false);

        loginButton = new Button("Login");
        loginButton.setStyle(StyleConstants.BTN_PRIMARY_STYLE);
        loginButton.setMaxWidth(Double.MAX_VALUE);
        loginButton.setOnAction(e -> handleLogin());
        StyleConstants.applyPrimaryHover(loginButton);

        passwordField.setOnAction(e -> handleLogin());

        HBox linkBox = new HBox(5);
        linkBox.setAlignment(Pos.CENTER);
        Label linkText = new Label("Don't have an account?");
        linkText.setStyle("-fx-text-fill: " + StyleConstants.TEXT_SECONDARY + "; -fx-font-size: 13px;");
        registerLink = new Hyperlink("Register here");
        registerLink.setStyle("-fx-text-fill: " + StyleConstants.PRIMARY_COLOR
                + "; -fx-font-weight: bold; -fx-font-size: 13px; -fx-underline: false;");
        registerLink.setOnAction(e -> ScreenNavigator.navigateTo(
                new RegisterScreen(), "Register - " + MainApp.APP_TITLE));
        linkBox.getChildren().addAll(linkText, registerLink);

        card.getChildren().addAll(header, form, errorLabel, loginButton, linkBox);
        return card;
    }

    /**
     * Creates the header with app icon and subtitle.
     *
     * @return header VBox
     */
    private VBox createHeader() {
        VBox header = new VBox(8);
        header.setAlignment(Pos.CENTER);

        Label titleLabel = new Label("💰 Expense Splitter");
        titleLabel.setStyle(StyleConstants.HEADING_STYLE);

        Label subtitleLabel = new Label("Sign in to your account");
        subtitleLabel.setStyle(StyleConstants.SUBHEADING_STYLE);

        header.getChildren().addAll(titleLabel, subtitleLabel);
        return header;
    }

    /**
     * Creates email and password fields with focus styling.
     *
     * @return form VBox
     */
    private VBox createForm() {
        VBox form = new VBox(16);
        form.setAlignment(Pos.CENTER_LEFT);

        VBox emailBox = new VBox(8);
        Label emailLabel = new Label("Email");
        emailLabel.setStyle(labelStyle());
        emailField = new TextField();
        emailField.setPromptText("Enter your email");
        emailField.setStyle(StyleConstants.INPUT_STYLE);
        emailField.setMaxWidth(Double.MAX_VALUE);
        StyleConstants.applyInputFocus(emailField);
        emailBox.getChildren().addAll(emailLabel, emailField);

        VBox passwordBox = new VBox(8);
        Label passwordLabel = new Label("Password");
        passwordLabel.setStyle(labelStyle());
        passwordField = new PasswordField();
        passwordField.setPromptText("Enter your password");
        passwordField.setStyle(StyleConstants.INPUT_STYLE);
        passwordField.setMaxWidth(Double.MAX_VALUE);
        StyleConstants.applyInputFocus(passwordField);
        passwordBox.getChildren().addAll(passwordLabel, passwordField);

        form.getChildren().addAll(emailBox, passwordBox);
        return form;
    }

    /**
     * Returns consistent bold label style for form fields.
     *
     * @return inline CSS string
     */
    private String labelStyle() {
        return "-fx-font-weight: bold; -fx-text-fill: " + StyleConstants.TEXT_PRIMARY + "; -fx-font-size: 13px;";
    }

    /**
     * Validates credentials and navigates to the dashboard on success.
     */
    private void handleLogin() {
        errorLabel.setText("");
        errorLabel.setVisible(false);

        String email = emailField.getText().trim();
        String password = passwordField.getText();

        if (!InputValidator.validateEmail(email)) {
            showError("Enter a valid email address");
            return;
        }
        if (!InputValidator.validatePassword(password)) {
            showError("Password must be at least 6 characters");
            return;
        }

        try {
            User user = userDAO.getUserByEmail(email);
            if (user == null) {
                showError("No account found with this email");
                return;
            }
            if (!PasswordHasher.verifyPassword(password, user.getPasswordHash())) {
                showError("Incorrect password. Try again.");
                return;
            }

            SessionManager.setCurrentUser(user);
            System.out.println("Login successful for: " + user.getName());
            ScreenNavigator.navigateTo(new DashboardScreen(), "Dashboard - " + MainApp.APP_TITLE);

        } catch (SQLException e) {
            showError("Database error: " + e.getMessage());
        }
    }

    /**
     * Shows an inline error message (no Alert popup).
     *
     * @param message error text
     */
    private void showError(String message) {
        errorLabel.setText(message);
        errorLabel.setVisible(true);
    }
}
