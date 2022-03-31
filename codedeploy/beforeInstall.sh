#!bin/bash

cd /home/ec2-user
sudo rm -v !("environment.env")
sudo pkill node

sudo systemctl stop webservice.service