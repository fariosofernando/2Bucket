FROM oven/bun:1-debian AS base

WORKDIR /app

COPY libssl1.1_1.1.1n-0+deb11u5_amd64.deb ./bin/
RUN apt-get update && \
    apt-get install -y wget ca-certificates && \
    dpkg -i ./bin/libssl1.1_1.1.1n-0+deb11u5_amd64.deb || true

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 4000

CMD ["sh", "-c", "bun run $(test \"$NODE_ENV\" = 'development' && echo 'dev' || echo 'start')"]
