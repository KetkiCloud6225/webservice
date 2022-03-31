#!bin/bash

cd /home/ec2-user
sudo pkill node

sudo systemctl stop webservice.service
