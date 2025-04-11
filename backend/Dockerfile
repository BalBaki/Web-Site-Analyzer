# 1. Playwright'ın resmi base image'ı
FROM mcr.microsoft.com/playwright:v1.43.1-jammy

# 2. Çalışma dizini
WORKDIR /app

# 3. package.json ve package-lock.json'ı kopyala ve install et
COPY package*.json ./
RUN npm install

# 4. Playwright browser'larını indir
RUN npx playwright install --with-deps

# 5. Diğer dosyaları kopyala (src, tsconfig, vs.)
COPY . .

# 6. TypeScript build
RUN npm run build

# 7. Port ayarla
ENV PORT=3000
EXPOSE 3000

# 8. Uygulama başlat
CMD ["node", "dist/main.js"]
