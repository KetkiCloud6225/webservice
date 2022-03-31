#!bin/bash

cd /home/ec2-user

sudo kill -9 $(pgrep node)

sudo systemctl stop webservice.service

sudo rm -rf webserver

sudo cp /environment.env /webserver

