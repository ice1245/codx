FROM ubuntu:latest

RUN apt-get update && apt install -y libarchive-tools docker.io
RUN curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
RUN chmod +x /usr/local/bin/docker-compose
RUN ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# python
RUN apt-get install -y software-properties-common gcc && \
    add-apt-repository -y ppa:deadsnakes/ppa

RUN apt-get install -y python3.6 python3-distutils python3-pip python3-apt net-tools

# Node
ARG NODE_VERSION=16.13.0
ENV NVM_DIR=/root/.nvm

RUN apt install -y curl
RUN curl -o- "https://raw.githubusercontent.com/creationix/nvm/v0.39.0/install.sh" | bash

RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

# npm global
RUN npm i -g yarn

# map global node_modules
RUN ln -s "/root/.nvm/versions/node/v${NODE_VERSION}/lib/node_modules" /node_modules

# aws
RUN apt install -y unzip
RUN curl -L "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip
RUN ./aws/install && aws --version

RUN echo "aws codeartifact login --tool npm --repository cyferd-common --namespace @cyferd --domain cyferd --region=eu-central-1" >> /awslogin
RUN chmod +x /awslogin

# python java
RUN apt install -y default-jre python python3

# Github cli
RUN curl -sL "https://github.com/cli/cli/releases/download/v2.3.0/gh_2.3.0_linux_amd64.deb" -o "github-cli.deb"
RUN dpkg -i github-cli.deb

# os tools
RUN apt install -y iputils-ping host lsof p7zip-full

## CODE-SERVER
RUN apt-get update \
 && apt-get install -y \
    curl \
    dumb-init \
    zsh \
    htop \
    locales \
    man \
    nano \
    git \
    git-lfs \
    procps \
    openssh-client \
    sudo \
    vim.tiny \
    lsb-release \
  && git lfs install \
  && rm -rf /var/lib/apt/lists/*

# https://wiki.debian.org/Locale#Manually
RUN sed -i "s/# en_US.UTF-8/en_US.UTF-8/" /etc/locale.gen \
  && locale-gen
ENV LANG=en_US.UTF-8

RUN adduser --gecos '' --disabled-password coder && \
  echo "coder ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/nopasswd

RUN ARCH="$(dpkg --print-architecture)" && \
    curl -fsSL "https://github.com/boxboat/fixuid/releases/download/v0.5/fixuid-0.5-linux-$ARCH.tar.gz" | tar -C /usr/local/bin -xzf - && \
    chown root:root /usr/local/bin/fixuid && \
    chmod 4755 /usr/local/bin/fixuid && \
    mkdir -p /etc/fixuid && \
    printf "user: coder\ngroup: coder\n" > /etc/fixuid/config.yml

ARG CODE_SERVER_VER=4.0.2
RUN ARCH="$(dpkg --print-architecture)" && \
    curl -fsSL "https://github.com/coder/code-server/releases/download/v${CODE_SERVER_VER}/code-server_${CODE_SERVER_VER}_${ARCH}.deb" > /tmp/code-server.deb

RUN dpkg -i /tmp/code-server.deb && rm /tmp/code-server*.deb

COPY --chown=coder code-server/.config.yaml /home/coder/.config/code-server/config.yaml
COPY --chown=coder code-server/settings.json /home/coder/.local/share/code-server/User/settings.json
## CODE-SERVER


## homebrew
RUN curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh > /brew.sh
RUN echo | bash /brew.sh
RUN echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> /home/coder/.profile
RUN eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
RUN chown -R coder /home/linuxbrew
## homebrew

## APPS
COPY --chown=coder apps /home/coder/apps
##


# restore user
USER coder