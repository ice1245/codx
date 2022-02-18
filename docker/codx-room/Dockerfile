FROM m1k1o/neko:firefox

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
ENV CODX_APPS=/home/coder/apps
COPY --chown=coder apps $CODX_APPS
##

## github
RUN mkdir /home/coder/codx
##

ENV PATH=$PATH:/usr/share/code
COPY supervisord.conf /etc/neko/supervisord/code.conf
COPY --chown=coder firefox/policies.json /usr/lib/firefox/distribution/policies.json
COPY --chown=coder firefox/neko.js /usr/lib/firefox/mozilla.cfg

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]