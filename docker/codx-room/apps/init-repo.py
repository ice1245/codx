import json, os, logging

logging.info("Initializing repository")

codxjson = None
with open('codx.json') as codx:
  codxjson = json.loads(codx)

apps = codxjson.get('apps')
if apps:
  for k,v in apps:
    logging.info("Installing dependencie: %s" % k)
    os.system('codx %s' % k)

tabs = codxjson.get('tabs')
if tabs:
  logging.info("Updating firefox open tabs: %s" % tabs)
  with open('/usr/lib/firefox/distribution/policies.json') as ffsettings:
    ffsettingsjson = json.loads(ffsettings)
  ffsettingsjson["Homepage"]["Additional"] = tabs
  with open('/usr/lib/firefox/distribution/policies.json', 'w') as ffsettings:
    ffsettings.write(json.dumps(ffsettingsjson))