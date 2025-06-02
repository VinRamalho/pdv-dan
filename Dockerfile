FROM node:20-slim

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia o restante do projeto
COPY . .

# Gera o build do projeto NestJS
RUN npm run build

# Expõe a porta da aplicação (ajuste se necessário)
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]
