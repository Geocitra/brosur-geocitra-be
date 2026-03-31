FROM node:20-alpine

# [CRITICAL FIX] Install OpenSSL agar Prisma Query Engine bisa berjalan di Alpine Linux
RUN apk add --no-cache openssl

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 4000
# [FIX] Arahkan langsung ke file main.js yang benar
CMD ["node", "dist/src/main.js"]
