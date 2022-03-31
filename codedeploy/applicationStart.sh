#!bin/bash

cd /home/ec2-user/webserver 
npm install
sudo systemctl start webservice.service