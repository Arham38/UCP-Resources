package com.expensesplitter.ai;

import weka.classifiers.bayes.NaiveBayes;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.converters.ConverterUtils.DataSource;

import java.io.InputStream;

/**
 * AI Module: Automatic expense category prediction using Weka Naive Bayes.
 * Implemented as a SINGLETON — model is trained once at application startup.
 *
 * Prediction pipeline:
 * 1. Fast-path keyword matching on the full title (substring checks)
 * 2. Weka Naive Bayes on each individual word in the title
 * 3. Safe default "Other" if nothing matches
 *
 * Student : Muhammad Arham | L1F23BSSE0372
 * Package : com.expensesplitter.ai
 */
public class MLCategoryPredictor {

    /** Singleton instance */
    private static MLCategoryPredictor instance = null;

    /** Classpath location of training ARFF */
    private static final String TRAINING_DATA_RESOURCE =
            "/com/expensesplitter/data/categories.arff";

    /** Weka Naive Bayes classifier */
    private NaiveBayes classifier;

    /** Training data structure reference */
    private Instances trainingData;

    /** Whether model has been trained successfully */
    private boolean modelLoaded = false;

    /** Private constructor — use getInstance() */
    private MLCategoryPredictor() {
    }

    /**
     * Returns the singleton MLCategoryPredictor instance.
     *
     * @return shared predictor instance
     */
    public static MLCategoryPredictor getInstance() {
        if (instance == null) {
            instance = new MLCategoryPredictor();
        }
        return instance;
    }

    /**
     * Loads and trains the Naive Bayes classifier from classpath ARFF (once only).
     */
    public void loadModel() {
        if (modelLoaded) {
            System.out.println("MLCategoryPredictor: Model already loaded, skipping.");
            return;
        }

        try {
            System.out.println("MLCategoryPredictor: Loading training data from classpath" + TRAINING_DATA_RESOURCE);

            InputStream inputStream = getClass().getResourceAsStream(TRAINING_DATA_RESOURCE);
            if (inputStream == null) {
                System.err.println("MLCategoryPredictor: categories.arff not found on classpath");
                return;
            }

            DataSource source = new DataSource(inputStream);
            trainingData = source.getDataSet();

            if (trainingData.classIndex() == -1) {
                trainingData.setClassIndex(trainingData.numAttributes() - 1);
            }

            System.out.println("MLCategoryPredictor: Loaded " + trainingData.numInstances() + " training examples");

            classifier = new NaiveBayes();
            classifier.buildClassifier(trainingData);

            modelLoaded = true;
            System.out.println("ML model loaded");

        } catch (Exception e) {
            System.err.println("MLCategoryPredictor: Error loading model: " + e.getMessage());
            e.printStackTrace();
            classifier = null;
            trainingData = null;
            modelLoaded = false;
        }
    }

    /**
     * Predicts expense category from the title text.
     *
     * @param expenseTitle user-entered expense title
     * @return predicted category string
     */
    public String predictCategory(String expenseTitle) {
        if (expenseTitle == null || expenseTitle.trim().isEmpty()) {
            return "Other";
        }

        // Normalize input
        String title = expenseTitle.toLowerCase().trim();

        // Step 1: Fast-path keyword matching before Weka
        String fastMatch = fastPathCategory(title);
        if (fastMatch != null) {
            System.out.println("Input: " + title + " → Predicted: " + fastMatch + " (fast-path)");
            return fastMatch;
        }

        // Step 2: Try Weka classifier on each word in the title
        if (modelLoaded && classifier != null && trainingData != null) {
            String[] words = title.split("\\s+");
            for (String word : words) {
                if (word.isEmpty()) {
                    continue;
                }
                String wekaResult = classifyKeyword(word);
                if (wekaResult != null && !"Other".equals(wekaResult)) {
                    System.out.println("Input: " + title + " → Predicted: " + wekaResult + " (word: " + word + ")");
                    return wekaResult;
                }
            }
            // Try full title as single keyword (e.g. one-word titles)
            String fullResult = classifyKeyword(title);
            if (fullResult != null) {
                System.out.println("Input: " + title + " → Predicted: " + fullResult);
                return fullResult;
            }
        }

        System.out.println("Input: " + title + " → Predicted: Other");
        return "Other";
    }

    /**
     * Fast-path substring matching for common expense keywords.
     *
     * @param lowerTitle lowercased trimmed title
     * @return matched category or null if no fast match
     */
    private String fastPathCategory(String lowerTitle) {
        // Exact category name in title
        if (lowerTitle.equals("food") || lowerTitle.contains("food")) {
            return "Food";
        }
        if (lowerTitle.contains("grocery") || lowerTitle.contains("groceries")) {
            return "Food";
        }
        if (lowerTitle.contains("meal") || lowerTitle.contains("pizza")
                || lowerTitle.contains("burger") || lowerTitle.contains("lunch")
                || lowerTitle.contains("dinner") || lowerTitle.contains("breakfast")
                || lowerTitle.contains("snack") || lowerTitle.contains("rice")
                || lowerTitle.contains("bread") || lowerTitle.contains("milk")) {
            return "Food";
        }
        if (lowerTitle.contains("uber") || lowerTitle.contains("taxi")
                || lowerTitle.contains("petrol") || lowerTitle.contains("fuel")
                || lowerTitle.contains("flight") || lowerTitle.contains("bus")
                || lowerTitle.contains("train") || lowerTitle.contains("ticket")) {
            return "Travel";
        }
        if (lowerTitle.contains("electricity") || lowerTitle.contains("electric")
                || lowerTitle.contains("bill") || lowerTitle.contains("internet")
                || lowerTitle.contains("wifi") || lowerTitle.contains("rent")
                || lowerTitle.contains("gas") || lowerTitle.contains("utility")) {
            return "Utilities";
        }
        if (lowerTitle.contains("netflix") || lowerTitle.contains("cinema")
                || lowerTitle.contains("movie") || lowerTitle.contains("spotify")
                || lowerTitle.contains("concert") || lowerTitle.contains("game")) {
            return "Entertainment";
        }
        if (lowerTitle.contains("clothes") || lowerTitle.contains("shoes")
                || lowerTitle.contains("shopping") || lowerTitle.contains("amazon")) {
            return "Shopping";
        }
        if (lowerTitle.contains("medicine") || lowerTitle.contains("doctor")
                || lowerTitle.contains("gym") || lowerTitle.contains("fee")) {
            return "Other";
        }
        return null;
    }

    /**
     * Runs Weka classification on a single keyword.
     *
     * @param keyword lowercase keyword
     * @return predicted category or null on failure
     */
    private String classifyKeyword(String keyword) {
        try {
            Attribute keywordAttr = trainingData.attribute(0);
            int keywordIndex = keywordAttr.indexOfValue(keyword);
            if (keywordIndex < 0) {
                return null;
            }

            Instance instance = new DenseInstance(trainingData.numAttributes());
            instance.setDataset(trainingData);
            instance.setValue(keywordAttr, keywordIndex);

            double classIndex = classifier.classifyInstance(instance);
            return trainingData.classAttribute().value((int) classIndex);

        } catch (Exception e) {
            System.err.println("MLCategoryPredictor: classify error for '" + keyword + "': " + e.getMessage());
            return null;
        }
    }

    /**
     * @return true if model is loaded and ready
     */
    public boolean isModelLoaded() {
        return modelLoaded;
    }
}
