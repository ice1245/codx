set -e
source ../load_env.sh
docker build -t codx/neko:latest .
# docker login -u $DOCKER_USER -p $DOCKER_PWD https://$DOCKER_DOMAIN
# docker image tag codx/neko:latest $DOCKER_DOMAIN/codx/neko:latest
# docker image push $DOCKER_DOMAIN/codx/neko