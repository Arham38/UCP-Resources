interface Coffee{
    public String getDescription();
    public double getPrice();
}
class SimpleCoffee implements Coffee{
    @Override
    public String getDescription() {
        return "Simple Coffee";
    }
    @Override
    public double getPrice() {return 200.1f;}
}
class MilkCoffee implements Coffee{
    Coffee coffee;
    public MilkCoffee(Coffee coffee){this.coffee=coffee;}
    @Override
    public String getDescription() {
        return coffee.getDescription()+" with ,Milk";
    }
    @Override
    public double getPrice() {
        return coffee.getPrice()+300;
    }
}
public class Decorator_Class
{
    public static void main(String[] args){
        SimpleCoffee coffee=new SimpleCoffee();
        MilkCoffee milkCoffee=new MilkCoffee(coffee);
        System.out.println("Description: "+milkCoffee.getDescription());
        System.out.println("Price: "+milkCoffee.getPrice());
    }
}
