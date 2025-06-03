# Etapa 1: Build del frontend
FROM node:20-slim AS client-builder
WORKDIR /app
COPY client ./client
RUN cd client && npm install && npm run build

# Etapa 2: Backend + frontend
FROM node:20-slim AS server
WORKDIR /app

# Copiar todo el backend
COPY . .

# Reemplazar la carpeta build del cliente con la generada
RUN rm -rf client/build
COPY --from=client-builder /app/client/build ./client/build

# Instalar dependencias y compilar backend
RUN npm install
RUN npm run build

# Puerto para Dokploy o cualquier PaaS
EXPOSE 3000

# Comando para arrancar el backend
CMD ["npm", "start"]

