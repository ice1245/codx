#!/bin/sh

until docker ps
do
  echo "waiting for docker..."
  sleep 1
done


echo "**************
    DOCKER READY $(docker-compose --version)
********************"

docker-compose -f docker-compose.yaml up