package com.expensesplitter.views;

import com.expensesplitter.dao.UserDAO;
import com.expensesplitter.models.User;
import com.expensesplitter.utils.InputValidator;
import com.expensesplitter.utils.PasswordHasher;
import com.expensesplitter.utils.StyleConstants;
import javafx.animation.PauseTransition;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.util.Duration;

import java.sql.SQLException;

/**
 * Registration screen for the AI-Powered Expense Splitter application.
 * Built entirely with pure JavaFX code (no FXML).
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.views
 */
public class RegisterScreen extends BorderPane {

    private TextField nameField;
    private TextField emailField;
    private PasswordField passwordField;
    private PasswordField confirmPasswordField;
    private Label errorLabel;
    private Label successLabel;
    private Button registerButton;
    private Hyperlink loginLink;

    private final UserDAO userDAO = new UserDAO();

    /**
     * Constructs the registration screen and builds all UI components.
     */
    public RegisterScreen() {
        setStyle("-fx-background-color: " + StyleConstants.SECONDARY_COLOR + ";");
        StackPane centerWrapper = new StackPane(createCard());
        setCenter(centerWrapper);
    }

    /**
     * Creates the centered registration card (440px wide, 40px padding).
     *
     * @return VBox registration card
     */
    private VBox createCard() {
        VBox card = new VBox(16);
        card.setStyle(StyleConstants.CARD_STYLE);
        card.setPadding(new Insets(40));
        card.setMaxWidth(440);
        card.setAlignment(Pos.CENTER);

        VBox header = createHeader();
        VBox form = createForm();

        errorLabel = new Label();
        errorLabel.setStyle(StyleConstants.ERROR_LABEL_STYLE);
        errorLabel.setWrapText(true);
        errorLabel.setAlignment(Pos.CENTER);
        errorLabel.setVisible(false);

        successLabel = new Label();
        successLabel.setStyle(StyleConstants.SUCCESS_LABEL_STYLE);
        successLabel.setWrapText(true);
        successLabel.setAlignment(Pos.CENTER);
        successLabel.setVisible(false);

        registerButton = new Button("Register");
        registerButton.setStyle(StyleConstants.BTN_PRIMARY_STYLE);
        registerButton.setMaxWidth(Double.MAX_VALUE);
        registerButton.setOnAction(e -> handleRegister());
        StyleConstants.applyPrimaryHover(registerButton);

        confirmPasswordField.setOnAction(e -> handleRegister());

        HBox linkBox = new HBox(5);
        linkBox.setAlignment(Pos.CENTER);
        Label linkText = new Label("Already have an account?");
        linkText.setStyle("-fx-text-fill: " + StyleConstants.TEXT_SECONDARY + "; -fx-font-size: 13px;");
        loginLink = new Hyperlink("Back to Login");
        loginLink.setStyle("-fx-text-fill: " + StyleConstants.PRIMARY_COLOR
                + "; -fx-font-weight: bold; -fx-font-size: 13px; -fx-underline: false;");
        loginLink.setOnAction(e -> ScreenNavigator.navigateTo(
                new LoginScreen(), "Login - " + MainApp.APP_TITLE));
        linkBox.getChildren().addAll(linkText, loginLink);

        card.getChildren().addAll(header, form, errorLabel, successLabel, registerButton, linkBox);
        return card;
    }

    /**
     * Creates the header section.
     *
     * @return header VBox
     */
    private VBox createHeader() {
        VBox header = new VBox(8);
        header.setAlignment(Pos.CENTER);

        Label titleLabel = new Label("Create Account");
        titleLabel.setStyle(StyleConstants.HEADING_STYLE);

        Label subtitleLabel = new Label("Join and start splitting expenses");
        subtitleLabel.setStyle(StyleConstants.SUBHEADING_STYLE);

        header.getChildren().addAll(titleLabel, subtitleLabel);
        return header;
    }

    /**
     * Creates all registration form fields.
     *
     * @return form VBox
     */
    private VBox createForm() {
        VBox form = new VBox(16);
        form.setAlignment(Pos.CENTER_LEFT);

        form.getChildren().addAll(
                createFieldBox("Full Name", nameField = new TextField(), "Enter your name"),
                createFieldBox("Email", emailField = new TextField(), "Enter your email"),
                createFieldBox("Password", passwordField = new PasswordField(), "Choose a password (min 6 chars)"),
                createFieldBox("Confirm Password", confirmPasswordField = new PasswordField(), "Confirm your password")
        );
        return form;
    }

    /**
     * Builds a labeled input row with focus styling.
     *
     * @param labelText   field label
     * @param field       input control
     * @param placeholder prompt text
     * @return field VBox
     */
    private VBox createFieldBox(String labelText, TextField field, String placeholder) {
        VBox box = new VBox(8);
        Label label = new Label(labelText);
        label.setStyle("-fx-font-weight: bold; -fx-text-fill: " + StyleConstants.TEXT_PRIMARY + "; -fx-font-size: 13px;");
        field.setPromptText(placeholder);
        field.setStyle(StyleConstants.INPUT_STYLE);
        field.setMaxWidth(Double.MAX_VALUE);
        StyleConstants.applyInputFocus(field);
        box.getChildren().addAll(label, field);
        return box;
    }

    /**
     * Validates input, creates the account, and navigates to login after success.
     */
    private void handleRegister() {
        errorLabel.setText("");
        errorLabel.setVisible(false);
        successLabel.setText("");
        successLabel.setVisible(false);

        String name = nameField.getText().trim();
        String email = emailField.getText().trim();
        String password = passwordField.getText();
        String confirmPassword = confirmPasswordField.getText();

        if (InputValidator.isEmpty(name) || InputValidator.isEmpty(email)
                || InputValidator.isEmpty(password) || InputValidator.isEmpty(confirmPassword)) {
            showError("All fields are required.");
            return;
        }
        if (!InputValidator.validateName(name)) {
            showError("Please enter a valid full name.");
            return;
        }
        if (!InputValidator.validateEmail(email)) {
            showError("Please enter a valid email address.");
            return;
        }
        if (!InputValidator.validatePassword(password)) {
            showError("Password must be at least 6 characters long.");
            return;
        }
        if (!password.equals(confirmPassword)) {
            showError("Passwords do not match.");
            return;
        }

        try {
            if (userDAO.getUserByEmail(email) != null) {
                showError("This email address is already registered.");
                return;
            }

            String hashedPassword = PasswordHasher.hashPassword(password);
            User newUser = new User(0, name, email, hashedPassword);

            if (userDAO.createUser(newUser)) {
                System.out.println("Registration successful for: " + newUser.getName());
                successLabel.setText("Account created! Please login.");
                successLabel.setVisible(true);
                registerButton.setDisable(true);

                PauseTransition delay = new PauseTransition(Duration.seconds(1));
                delay.setOnFinished(e -> {
                    clearFields();
                    registerButton.setDisable(false);
                    ScreenNavigator.navigateTo(new LoginScreen(), "Login - " + MainApp.APP_TITLE);
                });
                delay.play();
            } else {
                showError("Failed to create account. Please try again.");
            }
        } catch (SQLException e) {
            showError("Database error: " + e.getMessage());
        }
    }

    /**
     * Clears all form fields after successful registration navigation.
     */
    private void clearFields() {
        nameField.clear();
        emailField.clear();
        passwordField.clear();
        confirmPasswordField.clear();
        successLabel.setVisible(false);
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
