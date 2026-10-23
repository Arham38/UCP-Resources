
interface HandleQuires{
    String query(String query);
}
class OnlineQuery implements HandleQuires{
    @Override
    public String query(String query) {
        return "Online : \n\t " +query;
    }
}
class PhoneQuery implements HandleQuires{
    public String query(String query) {
        return "phone :  \n\t "+ query;
    }
}
class StoreQuery implements HandleQuires{
    public String query(String query) {
        return "store :  \n\t " + query;
    }
}
class QueryHandlerFactory{
    public static HandleQuires type(String type){
        if (type.equalsIgnoreCase("online")){
            return new OnlineQuery();
        }
        else if (type.equalsIgnoreCase("store")){
            return new StoreQuery();
        }
        else if (type.equalsIgnoreCase("mobile")){
            return new PhoneQuery();
        }
        else {
            throw new IllegalArgumentException("Invalid Query...");
        }
    }
}
public class Factory_Pattern {
    static void main() {
        HandleQuires sendQuery=QueryHandlerFactory.type("online");

        System.out.println("Query Handle "+sendQuery.query("Where IS My Order??"));
    }
}
