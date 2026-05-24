#* Stage 1: Base
FROM node:20-slim AS base
WORKDIR /app
RUN corepack enable

#* Stage 2: prod-deps (production-dependencies)
FROM base AS prod-deps

COPY pnpm-lock.yaml      ./
COPY pnpm-workspace.yaml ./
COPY package.json        ./ 

COPY packages/database/package.json ./packages/database/
COPY apps/backend/package.json      ./apps/backend/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --filter ...backend

#* Stage 3: build
FROM base AS build

COPY pnpm-lock.yaml      ./
COPY pnpm-workspace.yaml ./
COPY package.json        ./

COPY packages/database ./packages/database
COPY apps/backend      ./apps/backend

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --filter ...backend --filter @taskflow/database

RUN pnpm -w prisma:generate

RUN pnpm --filter ...backend build

#* Stage 4: prod
FROM node:20-slim AS prod
WORKDIR /app
RUN corepack enable

COPY --from=prod-deps /app ./

COPY --from=build /app/packages/database/generated ./packages/database/generated

COPY --from=build /app/apps/backend/dist ./apps/backend/dist

EXPOSE 3000

CMD ["node", "apps/backend/dist/main.js"]