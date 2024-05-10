FROM node:alpine

RUN apk add --no-cache bash

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./
COPY .env.docker .env

RUN chmod +x wait-for-it.sh
RUN chmod +x start.sh

# prisma command in start.sh depends on the database to be running,
# so the wait-for-it.sh script is used to wait for the database to be running
# before executing the prisma command.
CMD ["./wait-for-it.sh", "db:5432", "--", "./start.sh"]
