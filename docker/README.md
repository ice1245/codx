# codx deployment



### Docker registry

Create login user with
```
echo $(htpasswd -nb $DOCKER_USER $DOCKER_PWD) >> auth/docker.auth
```