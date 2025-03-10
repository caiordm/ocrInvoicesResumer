### **Rodando o projeto Next.js localmente**

1. **Pré-requisitos**:
   - **Node.js** instalado (versão recomendada: `v14.x.x` ou superior).
   - **NPM** ou **Yarn** como gerenciador de pacotes.

2. **Passos para rodar o projeto**:

   1. **Clone o repositório**:
      Se você ainda não fez o clone do repositório, use o seguinte comando:
      ```bash
      git clone https://seu-repositorio-nextjs.git
      cd nome-do-diretorio
      ```

   2. **Instale as dependências**:
      No diretório do projeto, execute o comando para instalar as dependências necessárias:
      - Usando **NPM**:
        ```bash
        npm install
        ```
      - Usando **Yarn**:
        ```bash
        yarn install
        ```

   3. **Configuração**:
    
    1. **Instalar o Prisma** (se ainda não estiver instalado):
    Se você ainda não tiver o Prisma no seu projeto Next.js, você pode instalar com os seguintes comandos:
    ```bash
    npm install prisma @prisma/client
    ```

    2. **Inicializar o Prisma**:
    Caso você não tenha inicializado o Prisma, rode:
    ```bash
    npx prisma init
    ```
    Isso criará o arquivo `prisma/schema.prisma`, onde você define os modelos (tabelas) do seu banco de dados.

    3. **Configurar o banco de dados**:
    No arquivo `prisma/schema.prisma`, você vai configurar a conexão com o banco de dados. Exemplo de configuração para um banco PostgreSQL:
    ```prisma
    datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL") // Definido no .env
    }
    ```

    4. **Rodar as Migrations**:
    Agora você pode rodar as migrations para gerar o esquema do banco de dados:
    ```bash
    npx prisma migrate dev --name init
    ```

   4. **Rodando o servidor de desenvolvimento**:
      Após instalar as dependências, rode o servidor de desenvolvimento com o seguinte comando:
      - Usando **NPM**:
        ```bash
        npm run dev
        ```
      - Usando **Yarn**:
        ```bash
        yarn dev
        ```

   5. **Acesse o projeto no navegador**:
      O servidor estará rodando no endereço `http://localhost:3000`. Acesse esse link no navegador para visualizar o seu projeto em execução.

