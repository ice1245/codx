docker build -t gbrian/neko .
docker login -u $DOCKER_LOGIN_USER -p $DOCKER_LOGIN_PWD 
docker push gbrian/neko:latest