import java.util.HashSet;
import java.util.Set;

class RideManager {
    private static RideManager instance;

    private Set<Integer> assignedRides = new HashSet<>();

    private RideManager() {
        System.out.println("RideManager created!");
    }
    public static RideManager getInstance() {
        if (instance == null) {
            instance = new RideManager();
        }
        return instance;
    }

    public void assignRide(String userName) {
        int rideNumber = assignedRides.size() + 1;
        assignedRides.add(rideNumber);
        System.out.println(userName + " assigned ride #" + rideNumber);
    }

    public void showAssignedRides() {
        System.out.println("Assigned rides: " + assignedRides);
    }
}

public class RideSharingApp {
    public static void main(String[] args) {

        RideManager user1 = RideManager.getInstance();
        user1.assignRide("User1");
        user1.assignRide("User2");

        RideManager user2 = RideManager.getInstance();
        user2.assignRide("User3");

        System.out.println("\n--- FIXED OUTPUT ---");
        user1.showAssignedRides();
        user2.showAssignedRides();
    }
}