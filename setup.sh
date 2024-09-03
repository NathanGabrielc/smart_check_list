#!/bin/bash

# Configuração de variáveis
DB_USER="postgres"
DB_NAME="smart_check_list"
PSQL_PATH="/c/Program Files/PostgreSQL/16/bin"

# Adicionar PostgreSQL ao PATH temporariamente
export PATH=$PATH:$PSQL_PATH

# Verificação se o banco de dados já existe
if psql -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "O banco de dados '${DB_NAME}' já existe. Pulando a criação do banco de dados."
else
    # Criação do banco de dados
    echo "Criando o banco de dados '${DB_NAME}'..."
    createdb -U $DB_USER $DB_NAME
fi

# Criação das tabelas
echo "Criando tabelas no banco de dados..."
psql -U $DB_USER -d $DB_NAME -c "
CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";

CREATE TABLE IF NOT EXISTS lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"

# Instalação das dependências do backend
echo "Instalando dependências do backend..."
cd server || { echo "Diretório 'server' não encontrado"; exit 1; }
npm install

# Instalação das dependências do frontend
echo "Instalando dependências do frontend..."
cd ../client || { echo "Diretório 'client' não encontrado"; exit 1; }
npm install

# Instalação das dependências globais
echo "Instalando dependências globais..."
npm install -g concurrently

# Volta para a raiz do projeto
cd ..

# Início do backend e frontend
echo "Iniciando o backend e o frontend..."
npm start