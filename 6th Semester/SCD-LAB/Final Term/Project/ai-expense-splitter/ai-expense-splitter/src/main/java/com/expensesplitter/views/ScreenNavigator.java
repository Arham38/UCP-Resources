package com.expensesplitter.views;

import javafx.animation.FadeTransition;
import javafx.scene.Parent;
import javafx.stage.Stage;
import javafx.util.Duration;

/**
 * Utility class to manage scene navigation across the application.
 * Provides a centralized way to switch between different screens with smooth transitions.
 * Uses a static Stage reference to control the main application window.
 *
 * Features:
 *   - Static Stage reference for navigation control
 *   - Smooth fade transition (150ms) on every navigation
 *   - Current title tracking
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.views
 */
public class ScreenNavigator {

    /** Static reference to the primary application Stage */
    private static Stage primaryStage;

    /** Current window title */
    private static String currentTitle;

    /** Private constructor to prevent instantiation - utility class */
    private ScreenNavigator() {}

    /**
     * Sets the primary Stage reference for navigation.
     * Must be called once during application initialization (typically in MainApp).
     *
     * @param stage the primary Stage of the JavaFX application
     */
    public static void setStage(Stage stage) {
        primaryStage = stage;
    }

    /**
     * Navigates to a new screen by replacing the current scene with a smooth fade transition.
     * Creates a new Scene with the given Parent node and sets it on the primary Stage.
     * Applies a 150ms fade transition for smooth visual effect.
     *
     * @param screen the Parent node (VBox, BorderPane, etc.) representing the new screen
     * @param title  the window title to display for this screen
     */
    public static void navigateTo(Parent screen, String title) {
        if (primaryStage == null) {
            throw new IllegalStateException("Primary Stage not set. Call setStage() first.");
        }

        // Store the new title
        currentTitle = title;

        // Create a new scene with the screen content
        javafx.scene.Scene scene = new javafx.scene.Scene(screen, 1000, 650);

        // Apply fade transition
        screen.setOpacity(0.0);
        FadeTransition fadeTransition = new FadeTransition(Duration.millis(150), screen);
        fadeTransition.setFromValue(0.0);
        fadeTransition.setToValue(1.0);
        fadeTransition.play();

        // Set the scene on the primary stage
        primaryStage.setScene(scene);

        // Update the window title
        primaryStage.setTitle(title);

        // Show the stage (in case it was hidden)
        primaryStage.show();
    }

    /**
     * Gets the primary Stage reference.
     * Useful for accessing stage properties from other screens.
     *
     * @return the primary Stage
     */
    public static Stage getStage() {
        return primaryStage;
    }

    /**
     * Gets the current window title.
     *
     * @return the current title string
     */
    public static String getCurrentTitle() {
        return currentTitle;
    }
}
