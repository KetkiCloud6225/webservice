#!bin/bash

cd /home/ec2-user

source ~/.bashrc

sudo shopt -s extglob

sudo rm !(*.env)

sudo shopt -u extglob

sudo pkill node

sudo systemctl stop webservice.service

