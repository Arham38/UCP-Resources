// File: ParkingSystem.java
abstract class Vehicle {
    private final String plateNumber;
    private final int hoursParked;

    static final int MAX_CHARGE = 1000;

    Vehicle(String plateNumber, int hoursParked) {
        this.plateNumber = plateNumber;
        this.hoursParked = hoursParked;
    }

    abstract int getRatePerHour();
    abstract String getTypeName();

    int calculateCharge() {
        return Math.min(hoursParked * getRatePerHour(), MAX_CHARGE);
    }

    private void printHeader() {
        System.out.println("------------------");
        System.out.println("Plate : " + plateNumber);
        System.out.println("Hours : " + hoursParked);
    }

    void printTicket() {
        printHeader();
        System.out.println("Charge : Rs. " + calculateCharge());
    }

    void printPassDetails() {
        printHeader();
        System.out.println("Type : " + getTypeName());
    }
}

class Car extends Vehicle {
    static final int RATE_PER_HOUR = 50;

    Car(String plateNumber, int hoursParked) {
        super(plateNumber, hoursParked);
    }

    @Override int getRatePerHour() { return RATE_PER_HOUR; }
    @Override String getTypeName() { return "Car"; }
}

class Bike extends Vehicle {
    static final int RATE_PER_HOUR = 20;

    Bike(String plateNumber, int hoursParked) {
        super(plateNumber, hoursParked);
    }

    @Override int getRatePerHour() { return RATE_PER_HOUR; }
    @Override String getTypeName() { return "Bike"; }
}

public class ParkingSystem {
    public static void main(String[] args) {
        Vehicle v1 = new Car("LEA-1234", 6);
        v1.printTicket();
        v1.printPassDetails();

        Vehicle v2 = new Bike("LHR-5678", 60);
        v2.printTicket();
        v2.printPassDetails();
    }
}