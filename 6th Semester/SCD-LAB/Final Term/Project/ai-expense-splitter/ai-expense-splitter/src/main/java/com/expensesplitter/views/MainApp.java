package com.expensesplitter.views;

import com.expensesplitter.ai.MLCategoryPredictor;
import com.expensesplitter.utils.DatabaseConnection;
import javafx.application.Application;
import javafx.application.Platform;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.stage.Stage;

import java.sql.SQLException;

public class MainApp extends Application {


    public static final String APP_TITLE = "AI-Powered Expense Splitter";


    @Override
    public void start(Stage primaryStage) {
        // Step 0: Set up global uncaught exception handler
        // Catches any unhandled exceptions and logs them to console
        Thread.setDefaultUncaughtExceptionHandler((thread, throwable) -> {
            System.err.println("Uncaught Exception in thread " + thread.getName() + ":");
            throwable.printStackTrace();
        });


        ScreenNavigator.setStage(primaryStage);


        try {
            DatabaseConnection.getInstance();
            System.out.println("Database connection verified successfully.");
        } catch (SQLException e) {
            // Show user-friendly alert and shut down gracefully
            System.err.println("Database connection failed: " + e.getMessage());
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setTitle("Database Error");
            alert.setHeaderText("Cannot connect to database");
            alert.setContentText("Cannot connect to database. Please start MySQL and try again.");
            alert.showAndWait();
            Platform.exit();
            return;
        }

        // Step 3: Load ML category predictor model once from classpath
        MLCategoryPredictor.getInstance().loadModel();

        // Step 4: Create LoginView and display as first scene (1000x650)
        LoginScreen loginScreen = new LoginScreen();
        Scene scene = new Scene(loginScreen, 1000, 650);

        // Configure and show the main window
        primaryStage.setTitle(APP_TITLE);
        primaryStage.setScene(scene);
        primaryStage.setResizable(true);
        primaryStage.show();

        System.out.println("AI-Powered Expense Splitter started successfully.");
    }

    /**
     * Application entry point.
     * Launches the JavaFX application.
     *
     * @param args command-line arguments (not used)
     */
    public static void main(String[] args) {
        launch(args);
    }
}
