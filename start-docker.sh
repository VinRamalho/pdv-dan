#!/bin/bash

# Nome do container
CONTAINER_NAME="app-pdv"

# Para e remove container antigo se existir
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
  echo "Removendo container antigo: $CONTAINER_NAME"
  docker stop $CONTAINER_NAME
  docker rm $CONTAINER_NAME
fi

# Build da imagem
echo "Construindo imagem Docker..."
docker build -t $CONTAINER_NAME .

# Sobe o container em segundo plano (detach mode)
echo "Iniciando container..."
docker run -d --name $CONTAINER_NAME -p 3001:3001 $CONTAINER_NAME

echo "Container '$CONTAINER_NAME' rodando em segundo plano na porta 3001."
