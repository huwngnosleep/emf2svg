# syntax=docker/dockerfile:1
FROM ubuntu

RUN apt-get update; apt-get install -y curl \
    && apt-get install -y wget \
    && curl -sL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y nodejs \
    && curl -L https://www.npmjs.com/install.sh | sh

RUN apt-get install -y gcc g++ \
    && apt-get install -y cmake pkg-config \
    && apt-get install -y libpng-dev libc6-dev libfontconfig1-dev libfreetype6-dev zlib1g-dev 

WORKDIR /app
COPY . .

RUN cmake ./libemf2svg -DCMAKE_INSTALL_PREFIX=/usr/ \
    && make \
    && make install

RUN npm install
RUN npm install -g pm2
CMD ["pm2-runtime", "ecosystem.config.js"]