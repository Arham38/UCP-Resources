package com.expensesplitter.views;

/**
 * Helper launcher class to run the JavaFX application.
 *
 * <p>This class is required as a workaround for JavaFX 9+ module system constraints
 * when launching the application from certain IDEs or jars without module-path options.
 * Because Launcher does not extend javafx.application.Application, the JVM allows
 * launching it from the standard classpath.</p>
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.views
 */
public class Launcher {

    /**
     * Entry point of the application. Delegates the startup call to MainApp.
     *
     * @param args Command-line arguments.
     */
    public static void main(String[] args) {
        MainApp.main(args);
    }
}
