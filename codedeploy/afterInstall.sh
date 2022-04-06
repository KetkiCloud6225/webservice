#!bin/bash

sudo systemctl stop webservice.service

sudo mv /home/ec2-user/webserver/cloudwatch-config.json /opt/

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/cloudwatch-config.json -s