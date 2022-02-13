export $( grep -vE "^(#.*|\s*)$" .env )
echo "Build internal images"
(cd codx-coder && docker build -t gbrian/coder:latest .)
(cd codx-neko && docker build -t gbrian/neko:latest .)
echo "publish"
docker login -u $DOCKER_LOGIN_USER -p $DOCKER_LOGIN_PWD 
docker push gbrian/coder:latest
docker push gbrian/neko:latest