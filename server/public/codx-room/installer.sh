echo "$(date): Start cloud-ini"  
# install docker following the guide: https://docs.docker.com/install/linux/docker-ce/ubuntu/
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get -y update
apt-get -y install docker-ce docker-ce-cli containerd.io
systemctl enable docker
echo "$(date): Install docker compose"
# install docker-compose following the guide: https://docs.docker.com/compose/install/
curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

echo "$(date): Waiting for docker"
until docker ps
do
  sleep 1
done

echo "$(date): Download services"
curl -L "https://${API_DOMAIN}/codx-room/docker-compose.codx-room.yaml" -o /docker-compose.codx-room.yaml
docker-compose -f /docker-compose.codx-room.yaml up -d