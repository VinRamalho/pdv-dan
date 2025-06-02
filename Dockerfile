FROM node:20-slim

# Instala dependências do sistema necessárias para o Chromium
RUN apt-get update && apt-get install -y \
  chromium \
  --no-install-recommends && \
  apt-get clean && rm -rf /var/lib/apt/lists/*



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
