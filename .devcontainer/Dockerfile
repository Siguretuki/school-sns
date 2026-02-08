FROM node:24-slim

RUN apt-get update && apt-get install -y \
    git sudo ca-certificates wget procps \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN npm i -g pnpm@10.25.0

RUN echo 'node ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER node
