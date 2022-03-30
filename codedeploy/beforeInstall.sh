#!bin/bash

cd /home/ec2-user
sudo rm -rf webapp
sudo pkill node

sudo systemctl stop webservice.service