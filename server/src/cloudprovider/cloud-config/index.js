
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
      ${env.map(([k, v]) => `export ${k}="${v}"`).join(" |\n")}
    append: true
runcmd:
  # install docker following the guide: https://docs.docker.com/install/linux/docker-ce/ubuntu/
  - curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
  - sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
  - sudo apt-get -y update
  - sudo apt-get -y install docker-ce docker-ce-cli containerd.io
  - sudo systemctl enable docker
  # install docker-compose following the guide: https://docs.docker.com/compose/install/
  - sudo curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  - sudo chmod +x /usr/local/bin/docker-compose
  - sudo curl -L "https://" -o /usr/local/bin/docker-compose
`

module.exports = {
  "codx-room": base
}