#!/bin/bash
docker run -d --name=dindy --privileged tiangolo/docker-with-compose

for dc in /docker-compose/* ; do
  [ -L "${dc%/}" ] && continue
  echo "Installing $dc"
  # docker-compose -f $dc up -d
done