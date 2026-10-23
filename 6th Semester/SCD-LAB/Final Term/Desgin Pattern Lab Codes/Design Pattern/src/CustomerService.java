interface HandleQuires{
    void query(String query);
}
class InStoreQuires implements HandleQuires{
    @Override
    public void query(String query) {
        System.out.println("Handling Query in Store->"+query);
    }
}
class OnlineQuery implements HandleQuires{
    @Override
    public void query(String query) {
        System.out.println("Handling Query Online->"+query);
    }
}
class PhoneQuery implements HandleQuires{
    @Override
    public void query(String query) {
        System.out.println("Handling Query On Mobile->"+query);
    }
}
class QueryHandlerFactory{
    public static HandleQuires sendQuery(String type){
        if (type.equalsIgnoreCase("in-store")){
            return new InStoreQuires();
        } else if (type.equalsIgnoreCase("online")) {
            return new OnlineQuery();
        } else if (type.equalsIgnoreCase("phone")) {
            return new PhoneQuery();
        }else {
            throw new IllegalArgumentException("Invalid Query Type.");
        }
    }
}
public class CustomerService {
    public static void main(String[] args) {
        HandleQuires quires=QueryHandlerFactory.sendQuery("Online");
        quires.query("Where is My Order?");
    }
}
