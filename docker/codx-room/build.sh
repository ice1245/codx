set -e
source ./.env
docker build -t codx/neko:latest .
echo docker login -u $DOCKER_LOGIN_USER -p $DOCKER_LOGIN_PWD $DOCKER_DOMAIN
docker image tag codx/neko:latest $DOCKER_DOMAIN/gbrian/codx:latest
docker image push $DOCKER_DOMAIN/gbrian/codx