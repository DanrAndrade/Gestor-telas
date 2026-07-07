# G3 Clínica — Sistema de Gestão Clínica

Sistema de gestão para clínicas médicas e odontológicas com frontend React (Vite + Tailwind) e backend FastAPI (Python).

---

## 🗂️ Estrutura do Projeto

```
clinica-redesign/
├── src/                     # Frontend React
│   ├── modules/dashboard/pages/   # Todas as telas do sistema
│   ├── services/api.ts            # 🔌 Camada de API (conecta ao backend)
│   └── components/ui/shared.tsx   # Componentes reutilizáveis
│
├── backend/                 # Backend FastAPI (Python)
│   ├── app/
│   │   ├── database.py      # Conexão SQLite
│   │   ├── models.py        # Tabelas (Paciente, Consulta, Prescricao)
│   │   ├── schemas.py       # Validação Pydantic
│   │   └── services/
│   │       ├── memed.py     # Integração Memed (prescrição digital)
│   │       └── cid.py       # Busca CID (diagnósticos)
│   ├── main.py              # Ponto de entrada da API
│   ├── requirements.txt     # Dependências Python
│   └── .env.example         # Variáveis de ambiente necessárias
│
├── .env.example             # Variáveis do frontend
└── .env                     # (criar localmente, não commitado)
```

---

## 🚀 Como Rodar Localmente

### 1. Frontend (React)

```bash
# Instalar dependências
npm install

# Criar arquivo de ambiente
cp .env.example .env   # (Linux/Mac) ou copy .env.example .env (Windows)

# Rodar o servidor de desenvolvimento
npm run dev
# → http://localhost:5173
```

### 2. Backend (FastAPI)

```bash
cd backend

# Instalar dependências Python
pip install -r requirements.txt

# Criar arquivo de ambiente com as chaves reais
copy .env.example .env
# ⚠️ Editar .env com as chaves da Memed (ver seção abaixo)

# Rodar o servidor
python main.py
# → http://localhost:8000
# → Documentação Swagger: http://localhost:8000/docs
```

---

## 🔌 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/pacientes` | Lista todos os pacientes |
| POST | `/api/pacientes` | Cadastra novo paciente |
| GET | `/api/pacientes/{id}/consultas` | Lista consultas de um paciente |
| POST | `/api/consultas` | Registra nova consulta |
| GET | `/api/cid/search?q=termo` | Busca CID por código ou nome |
| GET | `/api/memed/token` | Gera token para o módulo de prescrição |
| GET | `/api/memed/medicamentos?q=termo` | Busca medicamentos/princípios ativos |
| POST | `/upload` | Upload de arquivos/imagens |

---

## 🔑 Variáveis de Ambiente

### backend/.env

```env
MEMED_API_KEY=sua_chave_aqui
MEMED_SECRET_KEY=sua_chave_secreta_aqui
MEMED_BASE_URL=https://api.memed.com.br/v1
```

> Para obter as chaves da Memed: https://memed.com.br/desenvolvedores

### .env (frontend)

```env
VITE_API_URL=http://localhost:8000
```

---

## 🧪 Como Testar as Integrações

### Testar CID
```bash
# Com o backend rodando:
curl http://localhost:8000/api/cid/search?q=diabetes
# Retorna: {"data":[{"codigo":"E11.9","descricao":"Diabetes mellitus..."}]}
```

### Testar Memed
```bash
# Requer chaves no backend/.env
curl http://localhost:8000/api/memed/token
```

### Testar via Swagger (recomendado)
Acesse: **http://localhost:8000/docs**

### Testar pela Interface
1. Frontend rodando em `http://localhost:5173`
2. Backend rodando em `http://localhost:8000`
3. Vá em **Pacientes → clique em qualquer paciente → aba "Nova Consulta"**
4. No campo **Diagnóstico (CID)** — digite "diabetes" ou "hipertensão" → aparecerá autocomplete
5. No campo **Alergias** — digite "dipirona" ou "penicilina" → busca via Memed
6. Clique em **"Abrir Prescrição"** → injeta o módulo Memed (requer chaves reais)

---

## 📋 Status das Integrações

| Integração | Status | Observação |
|------------|--------|------------|
| CID Busca | ✅ Funcionando | Mock interno com 8 CIDs — expandir com tabela completa |
| Memed Token | ✅ Funcionando | Requer `MEMED_API_KEY` + `MEMED_SECRET_KEY` no `.env` |
| Memed Medicamentos (alergias) | ✅ Funcionando | Mesmas chaves acima |
| Memed Script (UI prescrição) | ✅ Funcionando | Injeta `mdhub.js` com token no DOM |
| Pacientes CRUD | ✅ Funcionando | SQLite local |
| Consultas | ✅ Funcionando | SQLite local |

---

## 🖥️ Telas do Sistema

| Módulo | Tela | Dados Demo |
|--------|------|------------|
| Dashboard | Visão geral, gráficos | ✅ Demo |
| Pacientes | Lista, Perfil, Nova Consulta | ✅ 3 pacientes demo |
| Prontuário | Triagem, Evolução, Receituário | ✅ Demo |
| Agenda | Calendário de consultas | ✅ Demo |
| Odontograma | Arcadas, Histórico dental | ✅ Demo |
| Estoque | Produtos, Validade | ✅ Demo |
| Financeiro | Caixa, DRE, Recebimentos | ✅ Demo |
| Relatórios | Exportação de dados | ✅ Demo |
| Administração | Configurações, Usuários | ✅ Demo |

> Os dados de demonstração são carregados diretamente no frontend para que o sistema seja navegável sem backend.

---

## 🔧 Próximos Passos — Conectar Backend

O arquivo `src/services/api.ts` já tem todos os métodos prontos. Para cada tela, substituir o array mockado pela chamada de API:

### Exemplo: Lista de Pacientes

```typescript
// Antes (mockado em PacientesPage.tsx)
const pacientes = [
  { nome: 'João da Silva', ... },
  ...
]

// Depois (conectado ao backend)
import { pacientesApi } from '../../../services/api';

const [pacientes, setPacientes] = useState([]);
useEffect(() => {
  pacientesApi.listar().then(setPacientes);
}, []);
```

### Checklist do Backend

- [ ] Expandir CID — importar tabela completa CID-10 (CSV disponível no DataSUS)
- [ ] Conectar lista de pacientes ao banco real
- [ ] Implementar autenticação JWT
- [ ] Migrar SQLite → PostgreSQL para produção
- [ ] Adicionar endpoints de Agenda
- [ ] Adicionar endpoints de Estoque
- [ ] Adicionar endpoints Financeiros

---

## 🔒 Diretrizes de Segurança

Para os desenvolvedores que continuarão o projeto, é **crucial** implementar as seguintes medidas de segurança no código antes de levá-lo para produção:

### 1. Prevenção contra Brute Force (Rate Limit)
**O problema:** Falta de limite de tentativas em áreas como login, MFA e recuperação de senha, permitindo ataques de força bruta.
**A solução:** Aplicar limitação por IP, limitação por conta, política de lockout (bloquear a conta após X tentativas erradas) e utilizar um WAF (Web Application Firewall).

### 2. Configuração de CORS
**O problema:** Não configurar corretamente o Cross-Origin Resource Sharing (CORS), o que é uma falha crítica comum.
**A solução:** Configurar o CORS no backend criando uma *allowlist* (lista de permissões) contendo apenas os domínios de origem que realmente devem ter acesso à API.

### 3. Exposição de PII e Dados Sensíveis
**O problema:** A API retornar dados sensíveis do usuário (Personally Identifiable Information) sem necessidade (ex: devolver o hash da senha).
**A solução:** Enviar para o front-end apenas os dados que são estritamente necessários para a tela e aplicar criptografia para dados em repouso/trânsito quando for preciso.

### 4. Gerenciamento Seguro de Sessão (JWT)
**O problema:** Passar o token de sessão na URL (via GET) e fazer o logout apagando o token apenas no client (local storage) sem invalidá-lo no servidor.
**A solução:** Trafegar dados sensíveis e tokens via requisições POST/PUT (nos Headers, ou cookies HTTPOnly) e garantir que o back-end possua uma *blocklist* ou mecanismo para invalidar a sessão do JWT durante o logout.

### 5. Enumeração de Usuários
**O problema:** O sistema dizer explicitamente "e-mail não cadastrado" no login ou recuperação de senha. Isso permite que um atacante teste milhares de e-mails para descobrir quem tem conta no sistema.
**A solução:** Trocar o erro específico por uma mensagem genérica, como *"E-mail ou senha inválidos"* (no login) e *"Se o e-mail existir, um link foi enviado"* (na recuperação).

### 6. Injeção de SQL (SQL Injection)
**O problema:** Escrever consultas de banco de dados concatenando strings puras, o que abre brecha para atacantes manipularem a query e roubarem ou destruírem dados.
**A solução:** Utilizar sempre as parametrizações seguras do ORM (SQLAlchemy) para interagir com o banco de dados.

---

## 📦 Tecnologias

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router  
**Backend:** FastAPI, SQLAlchemy, Pydantic, SQLite (dev) → PostgreSQL (prod)  
**Integrações:** Memed API v1 (prescrição digital), CID-10/11
