FROM node:23-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm install
RUN npm run postinstall

COPY . .
RUN npm run build

FROM node:23-alpine 

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 5001 

RUN npx prisma generate

CMD ["npm", "run", "start:prod"]
