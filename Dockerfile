# Fase de construcción
FROM node:20-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Fase de producción
FROM node:20-alpine as prod

WORKDIR /app

# Copia package.json y package-lock.json
COPY package.json package-lock.json ./

# Instala solo dependencias de producción
RUN npm install --omit=dev

# Copia la salida de la build
COPY --from=build /app/.output ./.output

# Copia el directorio public para archivos estáticos
COPY --from=build /app/public ./public

# Crea el directorio para imágenes si no existe
RUN mkdir -p ./public/images/productos

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
