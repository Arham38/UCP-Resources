import java.awt.*;

interface Feature{
    public void display();
}
class SamSungMobile implements Feature{

    @Override
    public void display() {
        System.out.println("Samsung Mobile ");
    }
}


class SamSungTab implements Feature{

    @Override
    public void display() {
        System.out.println("Samsung Tab ");
    }
}
class AppleMobile implements Feature{

    @Override
    public void display() {
        System.out.println("Apple Mobile");
    }
}

class AppleTab implements Feature{

    @Override
    public void display() {
        System.out.println("Apple Tab");
    }
}

interface FactoryCreation{
    Feature createMobile();
    Feature createTab();
}
class SamsungFactory implements FactoryCreation{


    @Override
    public Feature createMobile() {
        return  new SamSungMobile();
    }

    @Override
    public Feature createTab() {
        return new SamSungTab();
    }
}
class AppleMobileFactory implements  FactoryCreation{


    @Override
    public Feature createMobile() {
        return new AppleMobile();
    }

    @Override
    public Feature createTab() {
        return new AppleTab();
    }
}
public class AbstractFactory {
    static void main(String[] args) {

        FactoryCreation factory=new AppleMobileFactory();
        Feature mobile=factory.createMobile();
        mobile.display();
        Feature tab=factory.createTab();
        tab.display();
    }
}
