import java.util.ArrayList;
import java.util.List;
interface Observer{
    void message(String message);}
class Student implements Observer {
    String name;
    public Student(String name){this.name=name;}
    @Override
    public void message(String message) {
        System.out.println(name +" received : "+ message);}}
class Teacher {
    List<Observer> student=new ArrayList<>();
    public void addObserver(Observer o){student.add(o);}
    public void notify_Message(String msg){
        for (Observer o:student){
            o.message(msg);
        }}}
public class Observer_Pattern {
    static void main(String[] args) {
        Student arham=new Student("Arham Bhatti");
        Student ansir=new Student("Ansir Sandha");
        Student hafeez=new Student("Hafeez Patwari");
        Teacher teacher=new Teacher();
        teacher.addObserver(arham);
        teacher.addObserver(hafeez);
        teacher.addObserver(ansir);
        teacher.notify_Message("Quiz Tomorrow");}}
