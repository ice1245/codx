#!/bin/bash
su coder --command "/home/coder/apps/clonse-clinic.sh"
# Run supervisor
/usr/bin/supervisord -c /etc/neko/supervisord.conf