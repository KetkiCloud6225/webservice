#!bin/bash

cd /home/ec2-user

sudo kill -9 $(pgrep node)

sudo systemctl stop webservice.service

sudo rm -rf webserver

pwd 

sudo cp environment.env webserver

