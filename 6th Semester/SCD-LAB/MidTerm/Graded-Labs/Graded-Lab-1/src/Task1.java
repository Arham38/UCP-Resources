
import java.util.Scanner;
class PredictionEngine {
    private int numberOfPeople;
    private double processingFactor;


    public PredictionEngine(int numberOfPeople, double processingFactor) {
        this.numberOfPeople = numberOfPeople;
        this.processingFactor = processingFactor;
    }


    public int getNumberOfPeople() {
        return numberOfPeople;
    }

    public void setNumberOfPeople(int numberOfPeople) {
        this.numberOfPeople = numberOfPeople;
    }

    public double getProcessingFactor() {
        return processingFactor;
    }

    public void setProcessingFactor(double processingFactor) {
        this.processingFactor = processingFactor;
    }


    public double compute() {
        return numberOfPeople * processingFactor;
    }
}

public class Task1 {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Enter number of people in queue: ");
        int people = input.nextInt();

        System.out.print("Enter desk processing factor: ");
        double factor = input.nextDouble();

        PredictionEngine engine = new PredictionEngine(people, factor);

        double predictedTime = engine.compute();

        System.out.println("Predicted Waiting Time: " + predictedTime + " minutes");


        if (predictedTime < 10) {
            System.out.println("Advisory: Short wait, proceed normally.");
        } else if (predictedTime < 30) {
            System.out.println("Advisory: Moderate wait, plan accordingly.");
        } else {
            System.out.println("Advisory: Long wait, consider coming later.");
        }

        input.close();
    }
}

