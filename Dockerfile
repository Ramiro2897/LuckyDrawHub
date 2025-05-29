# Etapa 1: Build del frontend
FROM node:20-slim AS client-builder
WORKDIR /app
COPY client ./client
COPY client/package.json client/package-lock.json ./client/
RUN cd client && npm install && npm run build

# Etapa 2: Backend + frontend en producción
FROM node:20-slim AS server
WORKDIR /app

# Copiar backend
COPY . .

# Reemplazar client/build generado
RUN rm -rf client/build
COPY --from=client-builder /app/client/build ./client/build

# Instalar dependencias backend
RUN npm install

# Puerto de escucha
EXPOSE 3000

# Comando para iniciar el backend
CMD ["npm", "start"]
