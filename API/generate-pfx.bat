@echo off
setlocal

REM Ruta del proyecto
cd /d E:\Proyectos\MVC_MicroServices_Angular\KitaApp-DotNet9Angular19-main\API\ssl

REM Ruta absoluta a openssl
set OPENSSL="C:\Program Files\OpenSSL-Win64\bin\openssl.exe"

REM Nombres de los archivos de entrada
set CERT=localhost.pem
set KEY=localhost-key.pem
set PFX=cert.pfx

REM Contraseña para proteger el .pfx
set PASSWORD=authorizationSSL

REM Comando para generar el .pfx usando OpenSSL
%OPENSSL% pkcs12 -export -out %PFX% -inkey %KEY% -in %CERT% -password pass:%PASSWORD%

echo.
echo Archivo .pfx generado correctamente: %PFX%
pause
endlocal
