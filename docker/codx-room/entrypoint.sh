#!/bin/bash

echo "entrypoint $GIT_REPO_PROJECT"

# Run supervisor
/usr/bin/supervisord -c /etc/neko/supervisord.conf