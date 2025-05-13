#!/bin/bash

echo "Esperando que SQL Server arranque..."
sleep 20

echo "Ejecutando script de inicialización..."
/opt/mssql-tools/bin/sqlcmd -S db -U sa -P 'Adm1nP@ssw0rd!' -i /scripts/KitaDB_data.sql

echo "Iniciando aplicación .NET..."
dotnet API.dll