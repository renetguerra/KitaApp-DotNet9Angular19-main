#!/bin/bash
sleep 20
/opt/mssql-tools/bin/sqlcmd -S db -U sa -P 'Adm1nP@ssw0rd!' -i /scripts/init.sql
dotnet API.dll
