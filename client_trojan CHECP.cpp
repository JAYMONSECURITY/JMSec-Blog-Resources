#include <stdio.h>
#include <winsock2.h> //manejar sockets
 
#pragma comment(lib,"ws2_32.lib") //libreria winsock para manejar sockets
 
int main(int argc , char *argv[])
{
    system("title CLIENT CHEE && color 1f"); //estetica
    //definimos y establecemos variables para la creacion de socket y envio y recibimiento de datos.
    WSADATA wsa;
    SOCKET s;
    struct sockaddr_in server;
    char *message , welcome[100], server_reply[2000];
    int recv_welcome, recv_size;
 
 
    printf("\n[+]Inicializando Winsock...");
    if (WSAStartup(MAKEWORD(2,2),&wsa) != 0)
    {
        printf("\n[+]Failed. Error Code : %d",WSAGetLastError());
        return 1;
    }
     
    printf("\n[+]Winsock Inicializado S/N.");
     
    //Creamos el socket
    if((s = socket(AF_INET , SOCK_STREAM , 0 )) == INVALID_SOCKET)
    {
        printf("\n[+]Could not create socket : %d" , WSAGetLastError());
    }
 
    printf("\n[+]Socket creado!!!");
     
     
    server.sin_addr.s_addr = inet_addr("127.0.0.1"); //establecemos la direccion IP a la que conectarnos, la podriamos pasar por argumento con argv[1]
    server.sin_family = AF_INET;
    server.sin_port = htons( 6000 ); //establecemos puerto al que conectarnos
 
    //Nos conectamos al servidor remoto
    if (connect(s , (struct sockaddr *)&server , sizeof(server)) < 0)
    {
        puts("\n[+]connect error");
        return 1;
    }
     
    puts("\n[+]Estamos Conectados!!!...");
     
     while(1) //establecemos bucle para mantener conexion abierta y lanzar cuantos comandos queramos ejecutar en el servidor remoto
     {

    printf("\n[+] Dato enviado: ");
    fflush(stdout);
    
    if(scanf("%100[^\n]", message) == 1) //Introducimos el comando a ejecutar en el servidor remoto, puede incluir espacios y todo tipo de caracteres
   {                                     //a excepcion de un cambio de linea. El comando se guarda en la variable "message".
     //   puts(message); 
        while(getchar() != '\n');        //establecemos sentencia para salir del bucle que realiza scanf si encontramos un "enter".
   }

    if( send(s , message , strlen(message) , 0) < 0)  //enviamos el comando contenido en "message" al servidor remoto
    {
        puts("\n[+]Send failed");
        return 1;
    }
    puts("\n[+]Datos enviados...\n");
     
    //Receive a reply from the server
    if((recv_size = recv(s , server_reply , 2000 , 0)) == SOCKET_ERROR) //recibimos un reply del servidor remoto para ver si ha llegado bien el comando enviado
    {
        puts("\n[+]Recv failed!!!");
    }
    
    puts("\n[+]Reply recibido!!!\n");
 
    //Añadimos un caracter NULL a los datos recibidos del servidor remoto antes de imprimirlo por pantalla
    server_reply[recv_size] = '\0';
    puts(server_reply);  //imprimimos por pantalla los datos recibidos del servidor remoto
    printf("\n\n");  //un par de enters para organizar la pantalla
    system("pause");  //pausamos la terminal para comprobar que todo va bien
    system("cls");    //una vez pulsado una tecla salimos de la pausa y limpiamos pantalla para volver a lanzar otro comando --> volvemos al inicio del bucle.
}
    closesocket(s);  //si sale del bucle while(1) cerramos socket y limpiamos buffers con WSACleanup
    WSACleanup();

    return 0;   //devuelve controles y libera asignaciones de memoria empleadas al procesador.
}
