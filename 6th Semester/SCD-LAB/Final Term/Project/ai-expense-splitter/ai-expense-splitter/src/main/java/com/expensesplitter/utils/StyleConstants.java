package com.expensesplitter.utils;

/**
 * Utility class containing reusable CSS style constants for the application.
 * Provides a centralized location for styling to ensure consistency across all screens.
 * All styles are applied via JavaFX setStyle() method (no external CSS files).
 *
 * Theme: Professional blue (#4A6FA5) + white + light gray (#F5F7FA)
 * Font: Segoe UI / Arial
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.utils
 */
public class StyleConstants {

    // ─────────────────────────────────────────────────────────────────────
    // COLOR CONSTANTS
    // ─────────────────────────────────────────────────────────────────────
    
    /** Primary accent color used throughout the application */
    public static final String PRIMARY_COLOR = "#4A6FA5";
    
    /** Secondary background color */
    public static final String SECONDARY_COLOR = "#F5F7FA";
    
    /** Dark color for sidebars and headers */
    public static final String DARK_COLOR = "#2C3E50";
    
    /** Success color for positive actions and messages */
    public static final String SUCCESS_COLOR = "#27AE60";
    
    /** Error color for errors and warnings */
    public static final String ERROR_COLOR = "#E74C3C";
    
    /** Warning color for caution messages */
    public static final String WARNING_COLOR = "#F39C12";
    
    /** Primary text color */
    public static final String TEXT_PRIMARY = "#2C3E50";
    
    /** Secondary text color */
    public static final String TEXT_SECONDARY = "#7F8C8D";
    
    /** Border color for cards and inputs */
    public static final String BORDER_COLOR = "#D0D8E4";

    /** Default font family for the application */
    public static final String FONT_FAMILY = "'Segoe UI', Arial";

    // ─────────────────────────────────────────────────────────────────────
    // COMPONENT STYLES
    // ─────────────────────────────────────────────────────────────────────
    
    /**
     * Card container styling with dropshadow.
     * Used for main content containers, form cards, and panels.
     */
    public static final String CARD_STYLE =
        "-fx-background-color: white; " +
        "-fx-border-color: " + BORDER_COLOR + "; " +
        "-fx-border-radius: 10; " +
        "-fx-background-radius: 10; " +
        "-fx-padding: 20; " +
        "-fx-effect: dropshadow(gaussian, rgba(0,0,0,0.08), 8, 0, 0, 2);";

    /**
     * Primary button styling - blue background with white text.
     * Used for main action buttons (Login, Register, Save, Search, etc.).
     */
    public static final String BTN_PRIMARY_STYLE =
        "-fx-background-color: " + PRIMARY_COLOR + "; " +
        "-fx-text-fill: white; " +
        "-fx-font-weight: bold; " +
        "-fx-border-radius: 6; " +
        "-fx-background-radius: 6; " +
        "-fx-padding: 10 20; " +
        "-fx-cursor: hand; " +
        "-fx-font-size: 13px;";

    /**
     * Primary button hover styling - darker blue.
     */
    public static final String BTN_PRIMARY_HOVER =
        "-fx-background-color: #3A5F95; " +
        "-fx-text-fill: white; " +
        "-fx-font-weight: bold; " +
        "-fx-border-radius: 6; " +
        "-fx-background-radius: 6; " +
        "-fx-padding: 10 20; " +
        "-fx-cursor: hand; " +
        "-fx-font-size: 13px;";

    /**
     * Secondary button styling - light background with primary text.
     * Used for secondary actions (Cancel, Back, Clear, etc.).
     */
    public static final String BTN_SECONDARY_STYLE =
        "-fx-background-color: #E8EDF3; " +
        "-fx-text-fill: " + PRIMARY_COLOR + "; " +
        "-fx-border-radius: 6; " +
        "-fx-background-radius: 6; " +
        "-fx-padding: 10 20; " +
        "-fx-cursor: hand;";

    /**
     * Secondary button hover styling — slightly darker background.
     */
    public static final String BTN_SECONDARY_HOVER =
        "-fx-background-color: #D8E3EE; " +
        "-fx-text-fill: " + PRIMARY_COLOR + "; " +
        "-fx-border-radius: 6; " +
        "-fx-background-radius: 6; " +
        "-fx-padding: 10 20; " +
        "-fx-cursor: hand;";

    /**
     * Danger button styling - red background with white text.
     * Used for destructive actions (Delete, Remove, Logout, etc.).
     */
    public static final String BTN_DANGER_STYLE =
        "-fx-background-color: " + ERROR_COLOR + "; " +
        "-fx-text-fill: white; " +
        "-fx-border-radius: 6; " +
        "-fx-background-radius: 6; " +
        "-fx-padding: 10 20; " +
        "-fx-cursor: hand;";

    /**
     * Danger button hover styling — darker red.
     */
    public static final String BTN_DANGER_HOVER =
        "-fx-background-color: #C0392B; " +
        "-fx-text-fill: white; " +
        "-fx-border-radius: 6; " +
        "-fx-background-radius: 6; " +
        "-fx-padding: 10 20; " +
        "-fx-cursor: hand;";

    /**
     * Sidebar styling - dark background.
     */
    public static final String SIDEBAR_STYLE =
        "-fx-background-color: " + DARK_COLOR + "; " +
        "-fx-padding: 0;";

    /**
     * Sidebar button default styling.
     */
    public static final String SIDEBAR_BTN_STYLE =
        "-fx-background-color: transparent; " +
        "-fx-text-fill: #BDC3C7; " +
        "-fx-font-size: 14px; " +
        "-fx-padding: 14 20; " +
        "-fx-cursor: hand; " +
        "-fx-alignment: CENTER-LEFT; " +
        "-fx-max-width: Infinity;";

    /**
     * Sidebar button hover styling.
     */
    public static final String SIDEBAR_BTN_HOVER =
        "-fx-background-color: #3D5166; " +
        "-fx-text-fill: white; " +
        "-fx-font-size: 14px; " +
        "-fx-padding: 14 20; " +
        "-fx-cursor: hand; " +
        "-fx-alignment: CENTER-LEFT; " +
        "-fx-max-width: Infinity;";

    /**
     * Sidebar button active/selected styling.
     */
    public static final String SIDEBAR_BTN_ACTIVE =
        "-fx-background-color: " + PRIMARY_COLOR + "; " +
        "-fx-text-fill: white; " +
        "-fx-font-size: 14px; " +
        "-fx-padding: 14 20; " +
        "-fx-font-weight: bold; " +
        "-fx-cursor: hand; " +
        "-fx-alignment: CENTER-LEFT; " +
        "-fx-max-width: Infinity;";

    /**
     * Top bar styling.
     */
    public static final String TOPBAR_STYLE =
        "-fx-background-color: white; " +
        "-fx-padding: 12 20; " +
        "-fx-border-color: #E0E6EF; " +
        "-fx-border-width: 0 0 1 0;";

    /**
     * Heading label styling.
     */
    public static final String HEADING_STYLE =
        "-fx-font-size: 22px; " +
        "-fx-font-weight: bold; " +
        "-fx-text-fill: " + TEXT_PRIMARY + ";";

    /**
     * Subheading label styling.
     */
    public static final String SUBHEADING_STYLE =
        "-fx-font-size: 14px; " +
        "-fx-text-fill: " + TEXT_SECONDARY + ";";

    /**
     * Input field styling (TextField, PasswordField).
     */
    public static final String INPUT_STYLE =
        "-fx-background-color: white; " +
        "-fx-border-color: " + BORDER_COLOR + "; " +
        "-fx-border-radius: 6; " +
        "-fx-background-radius: 6; " +
        "-fx-padding: 9 12; " +
        "-fx-font-size: 13px;";

    /**
     * Input field focused styling.
     */
    public static final String INPUT_FOCUS_STYLE =
        "-fx-background-color: white; " +
        "-fx-border-color: " + PRIMARY_COLOR + "; " +
        "-fx-border-radius: 6; " +
        "-fx-background-radius: 6; " +
        "-fx-padding: 9 12; " +
        "-fx-font-size: 13px;";

    /**
     * Error label styling.
     */
    public static final String ERROR_LABEL_STYLE =
        "-fx-text-fill: " + ERROR_COLOR + "; " +
        "-fx-font-size: 12px;";

    /**
     * Success label styling.
     */
    public static final String SUCCESS_LABEL_STYLE =
        "-fx-text-fill: " + SUCCESS_COLOR + "; " +
        "-fx-font-size: 12px;";

    /**
     * Metric card styling for dashboard analytics.
     */
    public static final String METRIC_CARD_STYLE =
        "-fx-background-color: white; " +
        "-fx-border-color: " + BORDER_COLOR + "; " +
        "-fx-border-radius: 10; " +
        "-fx-background-radius: 10; " +
        "-fx-padding: 16 20; " +
        "-fx-min-width: 180;";

    /**
     * Table view styling.
     */
    public static final String TABLE_STYLE =
        "-fx-background-color: white; " +
        "-fx-border-color: #E0E6EF; " +
        "-fx-border-radius: 8; " +
        "-fx-background-radius: 8;";

    /**
     * Anomaly alert card — white card with red left border accent.
     */
    public static final String ANOMALY_ALERT_STYLE =
        "-fx-background-color: white; " +
        "-fx-border-color: " + BORDER_COLOR + "; " +
        "-fx-border-radius: 10; " +
        "-fx-background-radius: 10; " +
        "-fx-border-width: 0 0 0 4; " +
        "-fx-border-color: " + ERROR_COLOR + "; " +
        "-fx-padding: 16 20;";

    /**
     * Applies primary button hover enter/exit handlers.
     *
     * @param button the button to style
     */
    public static void applyPrimaryHover(javafx.scene.control.Button button) {
        button.setOnMouseEntered(e -> button.setStyle(BTN_PRIMARY_HOVER));
        button.setOnMouseExited(e -> button.setStyle(BTN_PRIMARY_STYLE));
    }

    /**
     * Applies secondary button hover enter/exit handlers.
     *
     * @param button the button to style
     */
    public static void applySecondaryHover(javafx.scene.control.Button button) {
        button.setOnMouseEntered(e -> button.setStyle(BTN_SECONDARY_HOVER));
        button.setOnMouseExited(e -> button.setStyle(BTN_SECONDARY_STYLE));
    }

    /**
     * Applies danger button hover enter/exit handlers.
     *
     * @param button the button to style
     */
    public static void applyDangerHover(javafx.scene.control.Button button) {
        button.setOnMouseEntered(e -> button.setStyle(BTN_DANGER_HOVER));
        button.setOnMouseExited(e -> button.setStyle(BTN_DANGER_STYLE));
    }

    /**
     * Applies input focus border toggle between default and focus styles.
     *
     * @param input the text input control
     */
    public static void applyInputFocus(javafx.scene.control.TextInputControl input) {
        input.focusedProperty().addListener((obs, oldVal, focused) ->
                input.setStyle(focused ? INPUT_FOCUS_STYLE : INPUT_STYLE));
    }
}
