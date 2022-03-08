
const base = ({ env }) =>
`#cloud-config
groups:
  - docker
users:
  - default
  # the docker service account
  - name: docker-service
    groups: docker
package_upgrade: true
packages:
  - apt-transport-https
  - ca-certificates
  - curl
  - gnupg-agent
  - software-properties-common
write_files:
  - path: /etc/environment
    content: |
      ${env.map(([k, v]) => `${k}="${v}"`).join("\n      ")}
    append: true
runcmd:
  - sudo curl -L "https://${process.env.API_DOMAIN}/codx-room/installer.sh" -o /codx-room-installer.sh
  - sudo bash /codx-room-installer.sh
`
module.exports = {
  "codx-room": base,
}