# ✈️ FlightWatch

> Monitore e compare passagens aéreas com inteligência artificial

![version](https://img.shields.io/badge/version-1.0.0-blue)
![PWA](https://img.shields.io/badge/PWA-ready-green)
![Supabase](https://img.shields.io/badge/backend-Supabase-3ECF8E)

## 📦 Estrutura do Projeto

```
flightwatch/
├── index.html                          # Frontend PWA (single-file)
├── sw.js                               # Service Worker
├── manifest.json                       # PWA Manifest
├── README.md
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql      # Schema PostgreSQL + RLS
│   └── functions/
│       ├── search-flights/
│       │   └── index.ts                # Edge Function: proxy Amadeus API
│       └── ai-recommendations/
│           └── index.ts                # Edge Function: Claude AI
└── docs/
    └── setup.md
```

---

## 🚀 Setup Passo a Passo

### 1. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute `supabase/migrations/001_initial_schema.sql`
3. Vá em **Authentication → Providers** e ative:
   - **Email** (já ativo por padrão)
   - **Google** (requer OAuth credentials do Google Cloud Console)
4. Em **Authentication → URL Configuration**, adicione:
   - Site URL: `https://rafaelandrade88.github.io/flightwatch`
   - Redirect URLs: `https://rafaelandrade88.github.io/flightwatch`

### 2. Amadeus API

1. Acesse [developers.amadeus.com](https://developers.amadeus.com)
2. Crie uma conta e um novo app
3. Copie **Client ID** e **Client Secret** (sandbox gratuito)
4. Para produção, solicite acesso ao tier de produção

### 3. Deploy das Edge Functions

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref SEU_PROJECT_REF

# Configurar secrets
supabase secrets set AMADEUS_CLIENT_ID=seu_client_id
supabase secrets set AMADEUS_CLIENT_SECRET=seu_client_secret
supabase secrets set ANTHROPIC_API_KEY=sua_api_key

# Deploy das functions
supabase functions deploy search-flights
supabase functions deploy ai-recommendations
```

### 4. Configurar o Frontend

No `index.html`, substitua:

```javascript
const CONFIG = {
  SUPABASE_URL: 'https://SEU_PROJECT_ID.supabase.co',
  SUPABASE_KEY: 'SUA_ANON_KEY',           // Supabase → Settings → API
  EDGE_SEARCH: 'https://SEU_PROJECT_ID.supabase.co/functions/v1/search-flights',
  EDGE_REC:    'https://SEU_PROJECT_ID.supabase.co/functions/v1/ai-recommendations',
};
```

### 5. Deploy no GitHub Pages

```bash
# Criar repositório
git init
git remote add origin https://github.com/rafaelandrade88/flightwatch.git

# Primeiro commit
git add .
git commit -m "feat: initial FlightWatch PWA v1.0.0"
git push -u origin main

# Ativar GitHub Pages
# Settings → Pages → Deploy from branch: main, folder: / (root)
```

---

## 🔑 Variáveis de Ambiente (Edge Functions)

| Variável | Onde obter |
|---|---|
| `AMADEUS_CLIENT_ID` | developers.amadeus.com → Meu App |
| `AMADEUS_CLIENT_SECRET` | developers.amadeus.com → Meu App |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |

---

## 🎨 Sistema de Cores de Preços

| Cor | Significado | Critério |
|---|---|---|
| 🟢 Verde | Abaixo da média | Preço ≤ 85% da média da busca |
| 🟡 Amarelo | Na média | Preço entre 85% e 115% da média |
| 🔴 Vermelho | Acima da média | Preço > 115% da média |

---

## 📊 Arquitetura

```
[Browser PWA - GitHub Pages]
         │
         ├── Auth ──────────────────► Supabase Auth
         │                              (Google + Email)
         │
         ├── Busca de Voos ─────────► Supabase Edge Function
         │                              └─► Amadeus API v2
         │
         ├── Recomendações IA ──────► Supabase Edge Function
         │                              └─► Claude API (claude-sonnet-4-6)
         │
         └── Dados do usuário ──────► Supabase PostgreSQL
                                        ├── profiles
                                        ├── search_history
                                        └── favorites
```

---

## 📱 Funcionalidades

- [x] 🔐 Autenticação (Google + Email/Senha)
- [x] ✈️ Busca de voos com filtros completos
- [x] 🟢🟡🔴 Sistema de cores por precificação relativa
- [x] 🤖 Recomendações IA (Top 10 destinos)
- [x] ❤️ Favoritar voos
- [x] 📋 Histórico de buscas
- [x] 🔗 Links diretos para compra
- [x] 📱 PWA instalável
- [x] 🍔 Menu hambúrguer responsivo
- [x] 🌙 Dark mode nativo
- [x] 🔢 Controle de versão (v1.0.0)

---

## 🗺️ Roadmap

- [ ] v1.1.0 — Alertas de preço por e-mail (via Supabase Edge + Resend)
- [ ] v1.2.0 — Comparação side-by-side de voos
- [ ] v1.3.0 — Calendário de preços (heatmap mensal)
- [ ] v1.4.0 — Notificações push (Web Push API)
- [ ] v2.0.0 — Multi-destino / viagem com escalas customizadas

---

## 📝 Conventional Commits

```
feat: nova funcionalidade
fix: correção de bug
refactor: refatoração sem mudança de comportamento
perf: melhoria de performance
docs: documentação
style: formatação / UI
chore: tarefas de manutenção
```

## 📄 Licença

MIT © Rafao — 2024
