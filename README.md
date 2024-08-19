# URL Shortener API

## Descrição

Este é um projeto de API REST para encurtamento de URLs. A aplicação foi construída utilizando Node.js com o framework NestJS, Prisma ORM, PostgreSQL, Redis e OpenTelemetry para observabilidade. O projeto também faz uso de Docker para facilitar a execução e gerenciamento dos serviços.

## Requisitos

- Docker
- Docker Compose

## Estrutura do Projeto

- **NestJS**: Framework utilizado para construção da API.
- **Prisma ORM**: Utilizado para gerenciar as interações com o banco de dados PostgreSQL.
- **Redis**: Utilizado para caching de URLs e melhorias de performance no redirecionamento.
- **OpenTelemetry**: Utilizado para coletar métricas e traces para observabilidade.
- **PostgreSQL**: Banco de dados relacional utilizado para armazenar dados de URLs, usuários e cliques.

## Variáveis de Ambiente

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

## Como Rodar o Projeto

### Clone o Repositório

Clone o repositório do projeto em seu ambiente local.

```
git clone https://github.com/seu-repositorio.git
cd seu-repositorio
```

## Defina as Variáveis de Ambiente
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
### Deploy no Cloud (Exemplo: Google Cloud Run)
O projeto possui um pipeline configurado para realizar  deploy da aplicação utilizando Cloud Run.


### Pontos de Melhoria
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