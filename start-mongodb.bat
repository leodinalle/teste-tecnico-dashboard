@echo off
mkdir C:\data\db 2>nul
mkdir C:\data\log 2>nul
cd "C:\Program Files\MongoDB\Server\7.0\bin"
mongod --config mongod.conf
pause
