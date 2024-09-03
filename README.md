# Configuração do Projeto

Este projeto é um aplicativo de Check List desenvolvido como um trabalho de extensão, com um backend em Node.js utilizando PostgreSQL e um frontend em Typescrippt. Siga as etapas abaixo para configurar o ambiente de desenvolvimento.

## Requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Visual Studio Code](https://code.visualstudio.com/)

## Passos para Configuração

1. **Clone o Repositório**

   Clone o repositório do projeto para o seu ambiente local e navegue até o diretório do projeto:

   ```bash
   git clone https://github.com/NathanGabrielc/smart_check_list.git

   cd smart_check_list
   Configurar o Banco de Dados e o Projeto
   ```

Certifique-se de que o PostgreSQL está em execução.

Execute o script de configuração para configurar o banco de dados, instalar as dependências e iniciar o backend e o frontend:

chmod +x setup.sh
./setup.sh
Acessar o Aplicativo

O frontend estará disponível em http://localhost:3000. O backend estará disponível em http://localhost:5000.

Estrutura do Projeto
/backend: Contém o código do servidor Node.js, que utiliza PostgreSQL como banco de dados.
/frontend: Contém o código do aplicativo React.
