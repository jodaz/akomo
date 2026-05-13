FROM node:22-alpine AS base
RUN npm install -g pnpm

FROM base AS build
WORKDIR /app
COPY . .
RUN pnpm config set only-allow-trusted-dependencies false
RUN pnpm install --frozen-lockfile
RUN npx prisma generate
RUN pnpm run build

EXPOSE 3000
CMD [ "node", "dist/main" ]
