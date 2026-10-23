interface MobileDevice{
    void checkBattery();
}
interface LaptopDevice{
    void runDiagnostics();
}
class Smartphones implements MobileDevice{
    @Override
    public void checkBattery() {
        System.out.println("SmartPhones battery check...");
    }
}
class Tablets implements MobileDevice{
    @Override
    public void checkBattery() {
        System.out.println("Tablets battery check...");
    }
}
class Smartwatches implements MobileDevice{
    @Override
    public void checkBattery() {
        System.out.println("Smartwatch battery check...");
    }
}

class Gaming implements LaptopDevice{
    @Override
    public void runDiagnostics() {
        System.out.println("Running diagnostics on Gaming...");

    }
}
class Business implements LaptopDevice{
    @Override
    public void runDiagnostics() {
        System.out.println("Running diagnostics on Business...");

    }
}
class Ultrabooks implements LaptopDevice{
    @Override
    public void runDiagnostics() {
        System.out.println("Running diagnostics on Ultrabook...");

    }
}

interface ElectronicFactory{
    MobileDevice createMobile(String type);
    LaptopDevice createLaptop(String type);
}
class MobileFactory implements ElectronicFactory{
    public MobileDevice createMobile(String type) {
        if (type.equalsIgnoreCase("smartphone")) {
            return new Smartphones();
        } else if (type.equalsIgnoreCase("tablet")) {
            return new Tablets();
        } else if (type.equalsIgnoreCase("smartwatch")) {
            return new Smartwatches();
        }
        throw new IllegalArgumentException("Invalid mobile type");
    }

    @Override
    public LaptopDevice createLaptop(String type) {
        return null;
    }
}
class LaptopFactory implements ElectronicFactory{
    @Override
    public MobileDevice createMobile(String type) {
        return null;
    }

    public LaptopDevice createLaptop(String type) {
        if (type.equalsIgnoreCase("gaming")) {
            return new Gaming();
        } else if (type.equalsIgnoreCase("business")) {
            return new Business();
        } else if (type.equalsIgnoreCase("ultrabook")) {
            return new Ultrabooks();
        }
        throw new IllegalArgumentException("Invalid laptop type");
    }
}

class FactoryProducer{
    public static ElectronicFactory getFactory(String type){
        if (type.equalsIgnoreCase("Mobile")){
            return new MobileFactory();
        }else if (type.equalsIgnoreCase("Laptop")) {
            return new LaptopFactory();
        }else {
            throw new IllegalArgumentException("Invalid Type....");
        }
    }
}

public class OnlineStore {
    public static void main(String[] args) {
        ElectronicFactory factory=FactoryProducer.getFactory("Mobile");
        MobileDevice mobileDevice= factory.createMobile("smartphone");
        mobileDevice.checkBattery();
    }
}
