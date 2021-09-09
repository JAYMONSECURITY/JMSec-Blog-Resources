#include <stdio.h>
#include <windows.h>
//C:\Program Files (x86)\Mobo\Service      Ejecutar desde esta ruta porque es donde se encuentra adb.exe
int main(int argc, char *argv[])
{
    //empezar a las 0100HL
    
        system("adb shell am start -a android.intent.action.CALL -d tel:%2331%23TELF");
        Sleep(14000);
        system("adb shell input keyevent KEYCODE_ENDCALL");
        
        Sleep(1500000);  //0125HL
        system("adb shell am start -a android.intent.action.CALL -d tel:%2331%23TELF");
        Sleep(14000);  //3.5 TOQUES 
        system("adb shell input keyevent KEYCODE_ENDCALL");
        
        Sleep(1600000); //0155HL
        system("adb shell am start -a android.intent.action.CALL -d tel:%2331%23TELF");
        Sleep(12000);  //2.5 TOQUES
        system("adb shell input keyevent KEYCODE_ENDCALL");
/****************************************************************************************************/
    Sleep(1600000); //0230HL
        system("adb shell am start -a android.intent.action.CALL -d tel:%2331%23TELF");
        Sleep(12000); //2 TOQUES
        system("adb shell input keyevent KEYCODE_ENDCALL");
        
        Sleep(1500000); //0255HL
        system("adb shell am start -a android.intent.action.CALL -d tel:%2331%23TELF");
        Sleep(10000); //2 TOQUES
        system("adb shell input keyevent KEYCODE_ENDCALL");
    
     Sleep(1505000); //0320HL
        system("adb shell am start -a android.intent.action.CALL -d tel:%2331%23TELF");
        Sleep(10000); //2 TOQUES
        system("adb shell input keyevent KEYCODE_ENDCALL");
    
     Sleep(1605000); //0400HL
        system("adb shell am start -a android.intent.action.CALL -d tel:%2331%23TELF");
        Sleep(15000); //3.5 TOQUES
        system("adb shell input keyevent KEYCODE_ENDCALL");
    
    Sleep(1600000); //0430HL
        system("adb shell am start -a android.intent.action.CALL -d tel:%2331%23TELF");
        Sleep(15000); //3.5 TOQUES
        system("adb shell input keyevent KEYCODE_ENDCALL");
        
        Sleep(1600000); //0500HL
        system("adb shell am start -a android.intent.action.CALL -d tel:%2331%23TELF");
        Sleep(15000); //3.5 TOQUES
        system("adb shell input keyevent KEYCODE_ENDCALL");
        
        Sleep(1700000); //0600HL
        system("adb shell am start -a android.intent.action.CALL -d tel:%2331%23TELF");
        Sleep(15000); //3.5 TOQUES
        system("adb shell input keyevent KEYCODE_ENDCALL");
        
        return 0;
}
