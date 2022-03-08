#!/bin/bash
bash $CODX_APPS/clone-clinic.sh

# Run supervisor
/usr/bin/supervisord -c /etc/neko/supervisord.conf