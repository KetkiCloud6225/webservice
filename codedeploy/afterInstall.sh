#!bin/bash

sudo systemctl stop webservice.service

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/home/ec2-user/webserver/cloudwatch-config.json -s