# syntax=docker/dockerfile:1
FROM openjdk:16-slim-buster

RUN apt-get update; apt-get install -y curl \
    && curl -sL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y nodejs \
    && curl -L https://www.npmjs.com/install.sh | sh

RUN apt-get install -y gcc g++ \
    && apt-get install -y cmake pkg-config \
    && apt-get install -y libpng-dev libc6-dev libfontconfig1-dev libfreetype6-dev zlib1g-dev 

WORKDIR /app
COPY . .

# WORKDIR /app/libemf2svg
RUN cmake ./libemf2svg -DCMAKE_INSTALL_PREFIX=/usr/ \
    && make \
    && make install

# WORKDIR /app
EXPOSE 7749
RUN npm install
CMD ["npm", "start"]