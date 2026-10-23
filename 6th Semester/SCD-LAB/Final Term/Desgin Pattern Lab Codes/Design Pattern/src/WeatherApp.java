//import java.util.ArrayList;
//import java.util.List;
//
///*Problem:
//You are building a weather tracking system that notifies users whenever there is a change in
//weather conditions. Various clients (e.g., mobile app, website, email) need to receive these
//updates in real-time. The weather system should notify all clients whenever the weather data
//changes, without knowing how each client will use the data.
//Question:
//Which design pattern would you use to solve this problem?
//Question: Write Code in Java.*/
//interface Observer{
//    void update(String data);
//}
//class MobileApp implements Observer {
//    public void update(String weatherData) {
//        System.out.println("Mobile App received update: " + weatherData);
//    }
//}
//
//class Website implements Observer {
//    public void update(String weatherData) {
//        System.out.println("Website received update: " + weatherData);
//    }
//}
//
//class EmailService implements Observer {
//    public void update(String weatherData) {
//        System.out.println("Email Service received update: " + weatherData);
//    }
//}
//
//interface Subject{
//    void addObserver(Observer o);
//    void removeObserver(Observer o);
//    void notifyObservers();
//}
//class WeatherStation implements Subject{
//    private List<Observer> observers = new ArrayList<>();
//    private String weatherData;
//
//    public void setWeatherData(String data) {
//        this.weatherData = data;
//        notifyObservers();
//    }
//
//    @Override
//    public void addObserver(Observer o) {
//        observers.add(o);
//    }
//
//    @Override
//    public void removeObserver(Observer o) {
//        observers.remove(o);
//    }
//
//    @Override
//    public void notifyObservers() {
//      for (Observer o:observers){
//          o.update(weatherData);
//      }
//    }
//}
//public class WeatherApp {
//    public static void main(String[] args) {
//
//        WeatherStation station = new WeatherStation();
//
//
//        Observer mobile = new MobileApp();
//        Observer web = new Website();
//        Observer email = new EmailService();
//
//
//        station.addObserver(mobile);
//        station.addObserver(web);
//        station.addObserver(email);
//
//
//        station.setWeatherData("Sunny, 30°C");
//        System.out.println("------");
//
//        station.setWeatherData("Rainy, 22°C");
//    }
//}
