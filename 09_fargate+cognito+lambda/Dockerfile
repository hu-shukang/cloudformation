FROM public.ecr.aws/docker/library/node:20.11.1-alpine AS builder
RUN apk update

WORKDIR /app
COPY . /app

RUN npm ci
RUN npm run build

FROM public.ecr.aws/docker/library/node:20.11.1-alpine
RUN apk update
COPY --from=builder /app/dist .
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
RUN npm ci --omit=dev

ENV PORT 3000
EXPOSE 3000

CMD ["npm", "run", "start"]
