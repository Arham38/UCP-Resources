#include <iostream>
#include <unistd.h>
#include <fcntl.h>    // For open 
#include <cstdlib> 
using namespace std;

int main() {
   char buff[256];
   int chracters=0;
   int number=0;
   int strings=0;
   int special=0;
   int space=0;
   int fd=open("input.txt",O_RDONLY);
   if(fd<0){
      cout<<"File Cant Opend"<<endl;
      return -1;
   }
   int n;
   while ((n=read(fd,buff,256))>0)
   {
      
      for (size_t i = 0; i < n; i++)
      {
         chracters++;
         if (buff[i]==' ')
         {
            space++;
         }if(buff[i]>=1||buff[i]<=100){
            number++;
         }
      }
      write(1,buff,n);   
   }
   cout<<"Chracter: "<<chracters<<endl;
   cout<<"Spaces: "<<space<<endl;
   cout<<"Numbers: "<<number<<endl;
   close(fd);
   return 0;
}
