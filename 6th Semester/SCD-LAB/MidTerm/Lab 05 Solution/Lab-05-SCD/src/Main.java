class Student{
    static String school="Govt.High School";

    static int add(int a,int b){
        return a+b;
    }
    public Student(){

    }
}

public class Main {
    public static void main(String[] args){
        Student s1=new Student();
        System.out.println(Student.add(4,5));
        System.out.println(s1.school);
    }
}
