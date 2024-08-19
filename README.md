<p>
<a href="#sobre">Sobre</a> |
<a href="#tecnologia">Tecnologias</a> |
<a href="#variaveis">Variaveis</a> |
<a href="#back">Rodando o back-end</a> |
<a href="#features">Features</a> |
<a href="#melhorias">Pontos de Melhorias</a> |
<a href="#desenvolvedores">Desenvolvedores</a>
</p>

<h1 id="sobre"> Shortener API  </h1>

Este é um projeto de API REST para encurtamento de URLs. A aplicação foi construída utilizando Node.js com o framework NestJS, Prisma ORM, PostgreSQL, Redis e OpenTelemetry para observabilidade. O projeto também faz uso de Docker para facilitar a execução e gerenciamento dos serviços.


<h2 id="tecnologia">🛠 Tecnologias</h2>

- [**NodeJS**](https://nodejs.org/en/docs/): Plataforma JavaScript que permite rodar código no lado do servidor.
- [**NestJS**](https://nestjs.com/): Framework Node.js, baseado em TypeScript.
- [**TypeScript**](https://www.typescriptlang.org/): Linguagem de programação
- [**Bcrypt**](https://www.npmjs.com/package/bcrypt): Biblioteca para hash de senhas, garantindo armazenamento seguro.
- [**Prisma**](https://www.prisma.io/): ORM que simplifica o acesso a banco de dados com migrações, geração de schemas e consultas
- [**Redis**](https://redis.io/): Armazenamento em cache de dados na memória para melhorar a performance de consultas frequentes.
- [**OpenTelemetry**](https://opentelemetry.io/): Ferramenta para rastreamento distribuído e coleta de métricas de performance da aplicação.
- [**Prometheus**](https://prometheus.io/): Sistema de monitoramento e alerta utilizado para armazenar e exibir métricas da API.
- [**Grafana**](https://grafana.com/): Plataforma de visualização de métricas, permitindo criar dashboards a partir dos dados do Prometheus.
- [**Jaeger**](https://www.jaegertracing.io/): Ferramenta para rastreamento de transações distribuídas, usada para observar o fluxo de requisições na aplicação.
- [**Docker**](https://www.docker.com/): Ferramenta para conteinerização de aplicações
- [**PostgreSQL**](https://www.postgresql.org/): Banco de dados relacional 
- [**Jest**](https://jestjs.io/pt-BR/docs/api): Framework de testes utilizado para garantir a confiabilidade do código e cobertura de testes.



<h2 id="variaveis">📃 Variaveis de Ambiente</h2>

Antes de rodar o projeto, você precisará definir algumas variáveis de ambiente. Exemplo de um arquivo `.env`:

```env
DATABASE_URL=postgresql://root:root@postgresDB:5432/shortened?schema=public
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
BCRYPT_COST=10
BASE_URL=http://localhost:8080
OTEL_SERVICE_NAME=shortened-service
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318/v1/traces
```
<h2 id="back"> 🖥 Rodando o Back End (servidor)</h2>

### Pre-Requisitos
- Docker
- Docker Compose

### Clone o Repositório

Clone o repositório do projeto em seu ambiente local.

```
git clone https://github.com/deduardolima/nestjs-shortened.git
cd nestjs-shortened
```

### Defina as Variáveis de Ambiente
 Certifique-se de criar um arquivo .env na raiz do projeto com as variáveis de ambiente necessárias.

### Construir e Rodar com Docker
Para rodar a aplicação usando Docker Compose, execute o seguinte comando:
```
docker-compose up --build
```
Isso irá:

Construir a aplicação a partir do Dockerfile.
Subir os serviços definidos no docker-compose.yml (PostgreSQL, Redis, Prometheus, Grafana, Jaeger, etc.).

### Acessar a API

Após iniciar a aplicação, você pode acessar a API na URL [http://localhost:8080](http://localhost:8080).

A documentação da API estará disponível em [http://localhost:8080/api](http://localhost:8080/api) (Swagger).

### Banco de Dados

Para gerenciar o banco de dados, você pode acessar o PgAdmin na URL [http://localhost:5053](http://localhost:5053).

- **Usuário**: `email@email.com`
- **Senha**: `123456`

### Migrations do Prisma

Caso precise rodar as migrations manualmente, use o comando abaixo dentro do contêiner da aplicação:

```bash
docker exec -it shortened npx prisma migrate deploy
```
<h2 id="features">✔️ Features</h2>

A API possui endpoints para encurtar URLs, redirecionar URLs encurtadas, gerenciar cache com Redis, e observar métricas de performance usando OpenTelemetry.

🔐 Autenticação
- [x] Login com email e senha
- [x] Autenticação por token: Acesso protegido por autenticação baseada em token (JWT) para endpoints restritos.
📝 Cadastro de Usuário
- [x] Cadastro de usuário 
- [x] Criptografia da senha do tipo hash com Bcrypt
🔗 URLs Encurtadas
 - [x] Encurtar URL: Geração de URLs encurtadas associadas a um usuário autenticado.
 - [x] Redirecionamento de URL: Redireciona para a URL original com base no código da URL encurtada.
 - [x] Validação e Cache: Validação da URL encurtada e armazenamento em cache para melhorar a performance.
 - [x] Contabilização de Cliques: Registra o número de cliques/redirecionamentos em uma URL encurtada.

🔍 Consultas
 Consulta de URL por ID: Permite buscar a URL original a partir do ID da URL encurtada, validando se está no cache ou banco de dados.

📊 Observabilidade
 - [x] Métricas de Performance: Monitora e expõe métricas como latência, contagem de redirecionamentos, e taxa de cache hit/miss através de endpoints Prometheus.
 - [x] Tracing: Captura de traces de requisições HTTP para visualização no Jaeger.

🎲 Modelagem do Banco de Dados
- [x] Usuários: Armazena informações dos usuários, como email, senha criptografada e data de criação.
- [x] URLs Encurtadas: Relaciona a URL original com a URL encurtada, o usuário que a criou, e o número de cliques recebidos.

Exemplo de Endpoints
POST /auth/login
Realiza login com email e senha, retornando um token JWT.

POST /auth/register
Registra um novo usuário com email e senha criptografada.

POST /urls
Gera uma URL encurtada para o usuário autenticado.

GET /urls/{shortUrl}
Redireciona para a URL original associada ao código fornecido.

GET /urls/{shortUrl}/status
Retorna o status e estatísticas da URL encurtada, como cliques e dados de cache.

GET /metrics
Exibe métricas de performance da API (usado por Prometheus).


### Observabilidade

A aplicação já está configurada com OpenTelemetry para observabilidade. Você pode visualizar os traces e métricas nas seguintes interfaces:

- **Jaeger (Tracing)**: Acesse em [http://localhost:16686](http://localhost:16686)
- **Prometheus (Métricas)**: Acesse em [http://localhost:9090](http://localhost:9090)
- **Grafana (Dashboard)**: Acesse em [http://localhost:3001](http://localhost:3001)

### Testes

Para rodar os testes unitários, execute o seguinte comando:

```bash
npm run test
```
<h2 id="melhorias"> Pontos de Melhorias</h2>

 Divisão em Microsserviços: O encurtador pode ser dividido em diversos microsserviços independentes, como:
- Serviço de Encurtamento de URLs: Responsável por gerar, armazenar e redirecionar URLs.
- Serviço de Autenticação: Pode ser implementado usando soluções como AWS IAM ou Keycloak.
- Serviço de Usuários: Gerencia o cadastro, preferências e associações de URLs a usuários.
- Serviço de Contabilização de Cliques: Focado em registrar e analisar acessos aos links encurtados.
- Load Balancer: Distribuir o tráfego entre os microsserviços.

### Vantagens da Abordagem Microsserviços
- Escalabilidade Independente: Cada microsserviço pode escalar separadamente conforme necessário.
- Desacoplamento: Reduz a complexidade de cada serviço e permite equipes independentes trabalhando em diferentes áreas.
- Flexibilidade Tecnológica: Diferentes microsserviços podem ser implementados em tecnologias ou linguagens diferentes, conforme necessário.


### Desafios ao Implementar a Arquitetura de Microsserviços
- Complexidade Operacional
Desafio: Aumentar o número de microsserviços significa gerenciar mais componentes. Cada microsserviço precisa ser monitorado, implantado, escalado e atualizado separadamente.
Solução: Ferramentas de orquestração, como Kubernetes, podem ser utilizadas para simplificar a implantação e o gerenciamento dos microsserviços.
- Comunicação Entre Serviços
Desafio: Garantir a comunicação eficaz entre microsserviços é complicado. Decidir entre comunicação síncrona (via HTTP/gRPC) ou assíncrona 
Solução: Implementar padrões como Circuit Breakers e Retries para lidar com falhas temporárias entre serviços, e adotar uma Message Queue (RabbitMQ, Kafka) para comunicação assíncrona entre microsserviços quando apropriado.
- Autenticação e Autorização Centralizada
Desafio: Garantir que todos os microsserviços possam autenticar e autorizar usuários de maneira eficiente e segura, especialmente em um sistema com diversos serviços independentes.
Solução: Centralizar a autenticação com OAuth 2.0 ou OIDC, utilizando serviços como AWS IAM ou Keycloak, para emitir tokens JWT que podem ser validados por todos os microsserviços.
- Monitoramento e Observabilidade
Desafio: Monitorar e rastrear o desempenho e as falhas de múltiplos microsserviços distribuídos é mais complexo do que em um monólito.
Solução: Implementar soluções de observabilidade (Prometheus, Grafana, Jaeger) para coletar logs, métricas e traços distribuídos em tempo real, proporcionando visibilidade do comportamento do sistema.
- Orquestração e Deploy Contínuo
Desafio: Implementar pipelines de CI/CD para garantir que todos os microsserviços sejam construídos, testados e implantados de forma eficiente e independente.
Solução: Utilizar ferramentas de CI/CD como GitHub Actions, Jenkins ou GitLab CI, integradas com Kubernetes, para automatizar o deploy e a gestão de serviços.

<h2 id="desenvolvedores">👨‍💻 Desenvolvedores</h2>
<table>         
<td><a href="https://github.com/deduardolima"><img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/98969787?v=4" width="100px;" alt="Imagem profile Diego Lima desenvolvedor"/><br /><sub><b> Diego Lima</b></sub></a><br />   
</table>

<a href="#voltar">Voltar para o topo ⬆️</a>
