#!/bin/sh

until docker ps
do
  echo "waiting for docker..."
  sleep 1
done

echo "DOCKER READY $(docker-compose --version)"

if [ -f /images.tar ]; then
  echo "Load images"
  docker load -i /images.tar
  rm /images.tar
  # stop container to take snapshot
  shutdown -h now
fi

echo "Run compose"
docker-compose -f docker-compose.yaml up