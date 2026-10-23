import java.util.ArrayList;
import java.util.List;

interface Observer {
    void update(String bidder);
}
class EmailNotification implements Observer {
    public void update(String bidder) {
        System.out.println("Email sent to: " + bidder);
    }
}

class SMSNotification implements Observer {
    public void update(String bidder) {
        System.out.println("SMS sent to: " + bidder);
    }
}
interface Subject {
    void addObserver(Observer o);
    void removeObserver(Observer o);
    void notifyObservers();
}
class Auction implements Subject {

    private List<Observer> observers = new ArrayList<>();
    private String currentBidder;

    public void placeBid(String user) {
        currentBidder = user;
        System.out.println("Bid placed by: " + user);

        notifyObservers();
    }

    public void addObserver(Observer o) {
        observers.add(o);
    }

    public void removeObserver(Observer o) {
        observers.remove(o);
    }

    public void notifyObservers() {
        for (Observer o : observers) {
            o.update(currentBidder);
        }
    }
}
public class AuctionSystem {
    public static void main(String[] args) {

        Auction auction = new Auction();


        auction.addObserver(new EmailNotification());
        auction.addObserver(new SMSNotification());


        auction.placeBid("Arham");
    }
}