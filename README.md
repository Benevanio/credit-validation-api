# API de Consulta de Inadimplência - validaAPI Integration

> Sistema de gestão de pessoas e consulta de inadimplência integrado com a API validaAPI Experian, desenvolvido com **Clean Architecture** em Node.js + TypeScript.

---

## 🏗️ Arquitetura

Este projeto segue os princípios de **Clean Architecture** (Hexagonal Architecture), garantindo:

- ✅ Baixo acoplamento
- ✅ Alta testabilidade
- ✅ Independência de frameworks
- ✅ Separação clara de responsabilidades

### Camadas

```
src/
├── domain/              # Regras de negócio puras
│   ├── entities/        # Entidades do domínio
│   ├── enums/           # Enumerações
│   ├── repositories/    # Interfaces de repositórios
│   └── utils/           # Utilidades do domínio
│
├── application/         # Casos de uso
│   ├── usecases/        # Lógica de aplicação
│   └── dto/             # Data Transfer Objects
│
└── infrastructure/      # Adaptadores externos
    ├── http/            # Controllers e Routes
    ├── database/        # Implementações de repositórios
    ├── gateways/        # Integrações externas (validaAPI)
    └── security/        # Autenticação e autorização
```

---

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Fastify** - Framework web de alta performance
- **Knex.js** - Query builder SQL
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **ESLint** - Linting
- **ts-node** - Execução TypeScript

---

## 📋 Requisitos Funcionais

### RF01 - Cadastro de Pessoa
- CPF único e válido
- Campos: nome, data nascimento, email, telefone, endereço
- Validação de formato e normalização

### RF02 - Consulta de Inadimplência (validaAPI)
- Integração com API validaAPI Experian
- Retorna: status, valor total, quantidade de registros, última negativação

### RF03 - Registro de Inadimplência
- Persistência de consultas validaAPI
- Histórico completo de consultas

### RF04 - Atualização de Status
- Reconsulta validaAPI
- Atualização automática de status

### RF05 - Consulta de Pessoa
- Busca por CPF ou ID

### RF06 - Histórico de Consultas
- Log de todas consultas realizadas
- Tracking de tempo de resposta

### RF07 - Segurança
- Autenticação JWT
- Controle de acesso por perfil

---


# Exemplos de Chamadas à API

## 1️⃣ Cadastrar Pessoa

```bash
curl -X POST http://localhost:3000/api/persons \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678900",
    "name": "João Silva",
    "birthDate": "1990-01-15",
    "email": "joao.silva@email.com",
    "phone": "11987654321",
    "address": "Rua das Flores, 123 - São Paulo/SP"
  }'
```

**Resposta esperada:**
```json
{
  "id": 1,
  "cpf": "12345678900",
  "name": "João Silva",
  "birthDate": "1990-01-15",
  "email": "joao.silva@email.com",
  "phone": "11987654321",
  "address": "Rua das Flores, 123 - São Paulo/SP",
  "createdAt": "2025-12-22T20:00:00.000Z",
  "updatedAt": "2025-12-22T20:00:00.000Z"
}
```

---

## 2️⃣ Consultar Pessoa por CPF

```bash
curl -X GET http://localhost:3000/api/persons/12345678900
```

**Resposta esperada:**
```json
{
  "id": 1,
  "cpf": "12345678900",
  "name": "João Silva",
  "birthDate": "1990-01-15",
  "email": "joao.silva@email.com",
  "phone": "11987654321",
  "address": "Rua das Flores, 123 - São Paulo/SP"
}
```

---

## 3️⃣ Consultar Inadimplência no validaAPI

Esta rota consulta a API do validaAPI e registra o resultado no banco de dados.

```bash
curl -X GET http://localhost:3000/api/persons/12345678900/validaAPI
```

**Resposta esperada (INADIMPLENTE):**
```json
{
  "cpf": "12345678900",
  "status": "INADIMPLENTE",
  "totalAmount": 5432.50,
  "recordsCount": 3,
  "lastNegativationDate": "2025-11-15T00:00:00.000Z",
  "summary": "Pendências financeiras identificadas",
  "consultedAt": "2025-12-22T20:05:00.000Z"
}
```

**Resposta esperada (ADIMPLENTE):**
```json
{
  "cpf": "12345678900",
  "status": "ADIMPLENTE",
  "totalAmount": 0,
  "recordsCount": 0,
  "lastNegativationDate": null,
  "summary": "Sem pendências",
  "consultedAt": "2025-12-22T20:05:00.000Z"
}
```

---

## 4️⃣ Atualizar Status (Reconsultar validaAPI)

```bash
curl -X PUT http://localhost:3000/api/persons/12345678900/status
```

**Resposta esperada:**
```json
{
  "previousStatus": "INADIMPLENTE",
  "newStatus": "ADIMPLENTE"
}
```

---

## 5️⃣ Health Check

```bash
curl -X GET http://localhost:3000/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-22T20:00:00.000Z"
}
```

---

## 🔐 Com Autenticação JWT (Futuro)

Para usar JWT nas rotas protegidas:

```bash
curl -X GET http://localhost:3000/api/persons/12345678900/validaAPI \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📋 Integração com validaAPI Real

### Baseado na API Anti-Fraud Scores

A API validaAPI Experian segue o padrão:

**Endpoint de Autenticação:**
```
POST https://api.validaAPIexperian.com.br/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=SEU_CLIENT_ID
&client_secret=SEU_CLIENT_SECRET
```

**Endpoint de Consulta:**
```
POST https://api.validaAPIexperian.com.br/anti-fraud-scores/v1/consultas
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "documento": "12345678900",
  "tipoDocumento": "CPF"
}
```

**Resposta da API validaAPI:**
```json
{
  "score": 650,
  "risco": "MEDIO",
  "recomendacao": "ANALISAR",
  "negativacoes": [
    {
      "valor": 1500.00,
      "dataOcorrencia": "2025-11-15",
      "origem": "BANCO ABC"
    }
  ],
  "totalNegativos": 1,
  "valorTotal": 1500.00
}
```

---

## 🛠️ Testando com Postman

1. Importe a collection (criar arquivo separado)
2. Configure as variáveis de ambiente:
   - `baseURL`: http://localhost:3000
   - `cpf`: 12345678900

3. Execute na ordem:
   - Cadastrar Pessoa
   - Consultar Pessoa
   - Consultar validaAPI
   - Atualizar Status

---

## 📊 Logs do Sistema

Ao executar as chamadas, você verá logs como:

```
[SYSTEM] Initializing Fastify server
[SYSTEM] Configuring database connection
[SYSTEM] Setting up dependency injection
[SYSTEM] Registering routes
[SYSTEM] ✅ Server listening at http://0.0.0.0:3000

[CONTROLLER] POST /api/persons - Creating person
[USE CASE] CreatePerson - Starting
[USE CASE] CreatePerson - Person created with id: 1

[CONTROLLER] GET /api/persons/12345678900/validaAPI
[USE CASE] ConsultvalidaAPI - Consulting CPF: 123***
[GATEWAY validaAPI] Consulting CPF: 123***
[GATEWAY validaAPI] Response received in 520ms
[USE CASE] ConsultvalidaAPI - Status: INADIMPLENTE
```

---

## 🔄 Fluxo Completo de Teste

```bash
# 1. Executar migrations
npm run migrate

# 2. Iniciar servidor
npm start

# 3. Em outro terminal, executar os testes
# Cadastrar pessoa
curl -X POST http://localhost:3000/api/persons \
  -H "Content-Type: application/json" \
  -d '{"cpf":"12345678900","name":"João Silva","birthDate":"1990-01-15","email":"joao@email.com"}'

# Consultar validaAPI
curl -X GET http://localhost:3000/api/persons/12345678900/validaAPI

# Ver pessoa com dados
curl -X GET http://localhost:3000/api/persons/12345678900

# Atualizar status
curl -X PUT http://localhost:3000/api/persons/12345678900/status
```


## 🔧 Instalação

### 1. Clonar repositório
```bash
git clone <repository-url>
cd aula9
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
validaAPI_API_URL=https://api.validaAPIexperian.com.br
validaAPI_CLIENT_ID=seu_client_id
validaAPI_CLIENT_SECRET=seu_client_secret
JWT_SECRET=sua_chave_secreta_aqui
DATABASE_PATH=./db/sqlite3.database.db
```

### 4. Executar migrations
```bash
npm run migrate
```

### 5. Iniciar servidor
```bash
npm start
```

O servidor estará disponível em: **http://localhost:3000**

---

## 📡 Endpoints

### 🔹 POST `/api/persons` - Cadastrar Pessoa

**Request:**
```json
{
  "cpf": "12345678900",
  "name": "João Silva",
  "birthDate": "1990-01-15",
  "email": "joao.silva@email.com",
  "phone": "11987654321",
  "address": "Rua das Flores, 123 - São Paulo/SP"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "cpf": "12345678900",
  "name": "João Silva",
  "birthDate": "1990-01-15",
  "email": "joao.silva@email.com",
  "createdAt": "2025-12-22T20:00:00.000Z"
}
```

---

### 🔹 GET `/api/persons/:cpf` - Consultar Pessoa

**Response:**
```json
{
  "id": 1,
  "cpf": "12345678900",
  "name": "João Silva",
  "birthDate": "1990-01-15",
  "email": "joao.silva@email.com"
}
```

---

### 🔹 GET `/api/persons/:cpf/validaAPI` - Consultar Inadimplência

**Response:**
```json
{
  "cpf": "12345678900",
  "status": "INADIMPLENTE",
  "totalAmount": 5432.50,
  "recordsCount": 3,
  "lastNegativationDate": "2025-11-15T00:00:00.000Z",
  "summary": "Pendências financeiras identificadas",
  "consultedAt": "2025-12-22T20:05:00.000Z"
}
```

---

### 🔹 PUT `/api/persons/:cpf/status` - Atualizar Status

**Response:**
```json
{
  "previousStatus": "INADIMPLENTE",
  "newStatus": "ADIMPLENTE"
}
```

---

### 🔹 GET `/health` - Health Check

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-22T20:00:00.000Z"
}
```

---

## 🧪 Testando a API

### Com cURL

```bash
# 1. Cadastrar pessoa
curl -X POST http://localhost:3000/api/persons \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678900",
    "name": "João Silva",
    "birthDate": "1990-01-15",
    "email": "joao@email.com"
  }'

# 2. Consultar validaAPI
curl http://localhost:3000/api/persons/12345678900/validaAPI

# 3. Ver dados da pessoa
curl http://localhost:3000/api/persons/12345678900

# 4. Atualizar status
curl -X PUT http://localhost:3000/api/persons/12345678900/status
```

### Com Postman
Importe a collection disponível em `API_EXAMPLES.md`

---

## 🗃️ Estrutura do Banco de Dados

### Tabela: `persons`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | PK autoincrement |
| cpf | VARCHAR(11) | CPF único (sem formatação) |
| name | VARCHAR | Nome completo |
| birth_date | DATE | Data de nascimento |
| email | VARCHAR | Email |
| phone | VARCHAR | Telefone (opcional) |
| address | TEXT | Endereço (opcional) |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

### Tabela: `debts`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | PK autoincrement |
| person_id | INTEGER | FK para persons |
| cpf | VARCHAR(11) | CPF consultado |
| status | ENUM | ADIMPLENTE/INADIMPLENTE |
| total_amount | DECIMAL(14,2) | Valor total da dívida |
| records_count | INTEGER | Quantidade de registros |
| last_negativation_date | TIMESTAMP | Data da última negativação |
| origin | VARCHAR | Origem (validaAPI) |
| consulted_at | TIMESTAMP | Data/hora da consulta |
| summary | TEXT | Resumo da consulta |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

---

## 🔐 Integração com validaAPI

### Autenticação OAuth2

```typescript
// 1. Obter token
POST https://api.validaAPIexperian.com.br/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id={validaAPI_CLIENT_ID}
&client_secret={validaAPI_CLIENT_SECRET}
```

### Consulta Anti-Fraud Scores

```typescript
// 2. Consultar CPF
POST https://api.validaAPIexperian.com.br/anti-fraud-scores/v1/consultas
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "documento": "12345678900",
  "tipoDocumento": "CPF"
}
```

**Resposta validaAPI:**
```json
{
  "score": 650,
  "risco": "MEDIO",
  "recomendacao": "ANALISAR",
  "negativacoes": [...],
  "totalNegativos": 1,
  "valorTotal": 1500.00
}
```

---

## 📝 Scripts Disponíveis

```bash
npm start          # Inicia o servidor com nodemon
npm run migrate    # Executa migrations
npm run lint       # Executa ESLint
```

---

## 🛡️ Segurança

### Boas Práticas Implementadas

✅ **CPF mascarado nos logs** - Apenas 3 primeiros dígitos visíveis
✅ **Validação de entrada** - DTOs validados
✅ **Normalização de dados** - Email lowercase, CPF sem formatação
✅ **JWT preparado** - Infraestrutura pronta para autenticação
✅ **Secrets em .env** - Credenciais fora do código

### TODO - Melhorias de Segurança

- [ ] Rate limiting
- [ ] CORS configurado
- [ ] Helmet.js
- [ ] Input sanitization
- [ ] SQL injection protection (Knex já protege)

---

## 🎯 Padrões de Projeto

### Utilizados neste projeto:

1. **Repository Pattern** - Abstração de persistência
2. **Gateway Pattern** - Isolamento de APIs externas
3. **Dependency Injection** - Inversão de controle
4. **DTO Pattern** - Transferência de dados
5. **Use Case Pattern** - Encapsulamento de regras de negócio

---

## 📊 Logs do Sistema

O sistema possui logging estruturado em 3 níveis:

```
[SYSTEM]   - Inicialização e configuração
[USE CASE] - Execução de casos de uso
[GATEWAY]  - Integrações externas
[DATABASE] - Queries SQL (quando debug ativado)
[ROUTE]    - Requisições HTTP
```

**Exemplo:**
```
[SYSTEM] Initializing Fastify server
[SYSTEM] Configuring database connection
[SYSTEM] ✅ Server listening at http://0.0.0.0:3000

[CONTROLLER] POST /api/persons - Creating person
[USE CASE] CreatePerson - Creating person
[USE CASE] CreatePerson - Person created with id: 1

[GATEWAY validaAPI] Consulting CPF: 123***
[GATEWAY validaAPI] Response received in 520ms
```

---

## 🚧 Roadmap

### Próximas features:

- [ ] Autenticação JWT completa
- [ ] Testes unitários (Jest)
- [ ] Testes de integração
- [ ] Docker + Docker Compose
- [ ] CI/CD pipeline
- [ ] Documentação Swagger/OpenAPI
- [ ] Circuit Breaker no gateway validaAPI
- [ ] Cache de consultas (Redis)
- [ ] Metrics com Prometheus
- [ ] Logs estruturados (Winston/Pino)

---

## 📚 Documentação Adicional

- [API Examples](./API_EXAMPLES.md) - Exemplos detalhados de uso
- [validaAPI API Docs](https://developer.validaAPIexperian.com.br) - Documentação oficial

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é licenciado sob a licença ISC.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ para demonstrar **Clean Architecture** em Node.js

---

## 💡 Frase para Entrevista

> *"Este projeto demonstra Clean Architecture em Node.js, isolando a integração com o validaAPI em um gateway e concentrando regras de negócio nos use cases. A arquitetura garante baixo acoplamento, alta testabilidade e facilita manutenção e evolução do código."*
