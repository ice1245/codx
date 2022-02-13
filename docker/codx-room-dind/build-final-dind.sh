echo "Running codx/room:dind-base to final build"
docker rm -f dind-base || :
docker run --privileged --name dind-base codx/room:dind-base
docker commit dind-base codx/room:dind
docker rm -f dind-base
docker run --rm codx/room:dind