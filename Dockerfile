FROM node:latest

WORKDIR /backend
COPY . .
RUN npm install -g pnpm
RUN pnpm i
CMD [ "pnpm", "run", "dev" ]
