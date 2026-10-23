interface Meal {
    String getDescription();
    double getCost();
}
class BasicMeal implements Meal {

    public String getDescription() {
        return "Rice + Vegetables + Protein";
    }

    public double getCost() {
        return 5.0;
    }
}
class MealDecorator implements Meal {
    protected Meal meal;

    public MealDecorator(Meal meal) {
        this.meal = meal;
    }

    public String getDescription() {
        return meal.getDescription();
    }

    public double getCost() {
        return meal.getCost();
    }
}

class Nuts extends MealDecorator {

    public Nuts(Meal meal) {
        super(meal);
    }

    public String getDescription() {
        return meal.getDescription() + ", Nuts";
    }

    public double getCost() {
        return meal.getCost() + 1.5;
    }
}

class Fruits extends MealDecorator {

    public Fruits(Meal meal) {
        super(meal);
    }

    public String getDescription() {
        return meal.getDescription() + ", Fruits";
    }

    public double getCost() {
        return meal.getCost() + 2.0;
    }
}

class Sauce extends MealDecorator {

    public Sauce(Meal meal) {
        super(meal);
    }

    public String getDescription() {
        return meal.getDescription() + ", Sauce";
    }

    public double getCost() {
        return meal.getCost() + 1.0;
    }
}

public class MealApp {
    public static void main(String[] args) {

        Meal meal = new BasicMeal();

        meal = new Nuts(meal);
        meal = new Fruits(meal);
        meal = new Sauce(meal);

        System.out.println("Meal: " + meal.getDescription());
        System.out.println("Total Cost: $" + meal.getCost());
    }
}