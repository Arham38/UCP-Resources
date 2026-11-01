package config;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

//This class will read values from the config.properties file using Java's Properties class.
public class ConfigReader {
    private static Properties properties;
    static {
        try {
            // Load the config.properties file
            FileInputStream fileInputStream = new FileInputStream("src/main/resources/data.properties");
            properties = new Properties();
            properties.load(fileInputStream);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to load configuration file.");
        }
    }

    // Method to fetch property values
    public static String getProperty(String key) {
        return properties.getProperty(key);
    }
}