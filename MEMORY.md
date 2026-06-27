# Elegia Core Portal - Memória do Projeto

## Stack
- **Frontend:** React 18 + TypeScript + Vite (SWC)
- **UI:** shadcn/ui (Radix + Tailwind CSS 3) — tema escuro
- **Backend:** Node.js + Express (pasta `backend/`)
- **Database:** MySQL 5.7+/8.0
- **Auth:** JWT (email/senha) — admin via tabela `users`
- **Storage:** Upload local no servidor (`backend/uploads/`)
- **Deploy:** Host compartilhado — frontend em `elegialc.com.br`, backend em `api.elegialc.com.br`
- **Pagamentos:** Asaas (PIX, Boleto, Cartão) via API própria
- **Estado:** React Context + useState (sem Redux/Zustand)

## Estrutura de Diretórios
```
src/
├── pages/          # Rotas: Admin, Merch, Auth, Events, About, etc.
├── components/     # shadcn/ui + componentes custom (Navigation, Footer, etc.)
├── hooks/          # useAuth, useCart, useToast, use-mobile
├── types/          # merch.ts (ProductColor, CartItem, etc.)
├── services/       # api.ts (cliente do backend), checkout.ts, bandsintown.ts
backend/
├── src/            # Código Node.js/Express
│   ├── routes/     # auth, products, events, orders, checkout, webhook, upload
│   ├── services/   # asaas.ts
│   └── middleware/ # auth.ts (JWT)
├── scripts/        # setup-db.ts
├── schema.sql      # Script MySQL
└── uploads/        # Imagens dos produtos
supabase/           # Mantido apenas como histórico (não usado mais)
├── migrations/
└── config.toml
```

## Schema do Banco

### `products`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID PK | auto |
| `name` | TEXT | Nome do produto |
| `description` | TEXT | Descrição |
| `price` | DECIMAL(10,2) | Preço |
| `shipping_cost` | DECIMAL(10,2) | Frete |
| `image_url` | TEXT | URL da imagem principal (legado) |
| `images` | JSONB | `[{url, is_primary}]` — múltiplas imagens |
| `category` | ENUM | tshirts, hoodies, accessories, vinyl, limited |
| `sizes` | TEXT[] | Array de tamanhos |
| `colors` | JSONB | `[{name, hex}]` — cores |
| `stock` | INTEGER | Estoque |
| `featured` | BOOLEAN | Destaque |
| `stripe_price_id` | TEXT | Stripe (futuro) |
| `stripe_product_id` | TEXT | Stripe (futuro) |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

### `orders`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID PK | auto |
| `status` | ENUM | pending, received, confirmed, overdue, refunded, canceled |
| `customer_name` | TEXT | Nome do cliente |
| `customer_email` | TEXT | E-mail do cliente |
| `customer_cpf_cnpj` | TEXT | CPF/CNPJ |
| `customer_phone` | TEXT | Telefone |
| `customer_asaas_id` | TEXT | ID do cliente no Asaas |
| `items` | JSONB | Itens do carrinho |
| `subtotal` | DECIMAL(10,2) | Subtotal |
| `shipping_cost` | DECIMAL(10,2) | Frete |
| `total` | DECIMAL(10,2) | Total |
| `asaas_payment_id` | TEXT | ID do pagamento no Asaas |
| `payment_url` | TEXT | Link de pagamento Asaas |
| `pix_qr_code` | TEXT | QR Code PIX (base64) |
| `pix_payload` | TEXT | Código PIX copia e cola |
| `billing_type` | TEXT | PIX, BOLETO, CREDIT_CARD |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |
| `paid_at` | TIMESTAMPTZ | Data do pagamento |
| `tracking_code` | TEXT | Código de rastreio dos Correios/transportadora |
| `shipped_at` | TIMESTAMPTZ | Data de envio |

### `user_roles`
User ID + role (admin/user). Função `has_role()` para RLS.

### `events`
Eventos com título, data, local, descrição, imagem, link de ingressos.

## Funcionalidades Implementadas

### Admin (`/admin`)
- CRUD de eventos e produtos
- Upload de múltiplas imagens para produtos (Supabase Storage — bucket `product-images`)
- Escolha de imagem principal (estrela)
- Formulário de cores visual (color picker + nome)
- Proteção de rota (apenas admin)
- Aba de pedidos: lista, busca, filtro por status, visualização de detalhes, atualização de status e código de rastreio

### Storefront (`/merch`)
- Listagem de produtos com filtro por categoria
- Modal de detalhes com galeria de imagens
- Seleção de cor, tamanho, quantidade
- Carrinho (localStorage)
- Checkout com Asaas: PIX, Boleto e Cartão de Crédito
- Página de sucesso do pedido (`/merch/success`)
- Área do cliente (`/meus-pedidos`): consulta pedidos por e-mail + CPF/CNPJ, sem necessidade de login com senha

### Pagamentos (`netlify/functions`)
- `asaas-checkout`: cria cliente e cobrança no Asaas, salva pedido no Supabase
- `asaas-webhook`: recebe eventos do Asaas e atualiza status do pedido

## Tasks Pendentes

### 📌 Prioridade Alta
- [ ] **Executar migrations de orders:** Rodar no SQL Editor do Supabase Dashboard:
  - `20260627000000_create_orders.sql`
  - `20260627000001_add_address_to_orders.sql`
  - `20260627000002_add_tracking_to_orders.sql`
- [x] **Corrigir rota do checkout no Netlify:** Frontend agora chama `/api/asaas-checkout`, com rewrite `/api/*` → `/.netlify/functions/:splat` em `netlify.toml` e `public/_redirects`.
- [ ] **Configurar variáveis de ambiente no Netlify:** `ASAAS_API_KEY_HOMOLOG`, `ASAAS_API_KEY_PROD`, `ASAAS_SANDBOX`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] **Configurar webhook no Asaas:** Apontar `https://<seu-site>/.netlify/functions/asaas-webhook` para eventos de pagamento. Eventos obrigatórios: `PAYMENT_RECEIVED`, `PAYMENT_CONFIRMED`, `PAYMENT_OVERDUE`, `PAYMENT_REFUNDED`, `PAYMENT_DELETED`.
- [ ] **Criar bucket no Supabase:** Executar migration `20260623000002_add_images_to_products.sql` no SQL Editor do Supabase Dashboard para criar o bucket `product-images` e a coluna `images`
- [ ] **Tratar imagens excluídas ao deletar produtos** — limpar Storage também

### 📌 Prioridade Média
- [ ] **Responsividade:** Ajustar grid de imagens no admin para mobile
- [ ] **Loading states:** Melhorar feedback visual durante upload de imagens (progresso)
- [ ] **Modo escuro/claro:** Projeto só escuro hoje
- [ ] **SEO:** Tags meta, Open Graph para produtos

### 📌 Prioridade Baixa
- [ ] **Página do produto individual** (rota `/merch/:id`)
- [ ] **Variants de produto** (SKU, preço por cor/tamanho)
- [ ] **Cupons/descontos**
- [ ] **Avaliações do produto**

## Supabase

### URL
`https://tdpvwvcjpbqkmcxofgpq.supabase.co`

## Comandos

### Frontend
```bash
npm install
npm run dev         # Desenvolvimento (porta 8080)
npm run build       # Build produção (gera dist/)
npm run lint        # ESLint
```

### Backend
```bash
cd backend
npm install
npm run db:setup    # Cria o banco MySQL e o admin inicial
npm run dev         # Desenvolvimento (porta 3000)
npm run build       # Compila TypeScript para dist/
npm start           # Produção
```

## Deploy no Host Compartilhado

### Domínios
- **Site:** `https://elegialc.com.br`
- **API:** `https://api.elegialc.com.br`

### Banco de dados MySQL
1. Criar banco `elegia_core` no painel do host.
2. Rodar `backend/schema.sql` para criar as tabelas.
3. Ou executar `npm run db:setup` no servidor (requer acesso SSH/terminal).

### Backend (`api.elegialc.com.br`)
1. Fazer upload do conteúdo de `backend/` para o subdomínio.
2. Instalar dependências: `npm install --production`
3. Compilar: `npm run build`
4. Configurar `.env` com:
   - `PORT=3000` (ou porta disponível no host)
   - `FRONTEND_URL=https://elegialc.com.br`
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `JWT_SECRET`
   - `ASAAS_SANDBOX`, `ASAAS_API_KEY_HOMOLOG`, `ASAAS_API_KEY_PROD`
   - `ASAAS_WEBHOOK_TOKEN`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` (para criar o primeiro admin)
5. Iniciar com `npm start` (ou configurar PM2/cPanel Node.js).

### Frontend (`elegialc.com.br`)
1. Configurar `.env`:
   - `VITE_SITE_URL=https://elegialc.com.br`
   - `VITE_API_URL=https://api.elegialc.com.br/api`
2. Rodar `npm run build`.
3. Fazer upload do conteúdo da pasta `dist/` para a raiz do domínio.

### Upload de imagens
As imagens dos produtos são salvas em `backend/uploads/`. Certifique-se de que a pasta tenha permissão de escrita e esteja acessível via `https://api.elegialc.com.br/uploads/`.

## Asaas

### Configuração
1. Criar conta em [asaas.com](https://asaas.com) e gerar uma API key
2. Definir `ASAAS_SANDBOX=true` durante testes (URL: `https://api-sandbox.asaas.com/v3`)
3. Configurar variáveis de ambiente no backend:
   - `ASAAS_API_KEY_HOMOLOG` — chave da API Asaas em sandbox
   - `ASAAS_API_KEY_PROD` — chave da API Asaas em produção
   - `ASAAS_SANDBOX` — `true` para usar sandbox + chave de homologação, `false` para produção + chave de produção
   - `ASAAS_WEBHOOK_TOKEN` — token de autenticação do webhook

### Webhook
- URL: `https://api.elegialc.com.br/api/webhook/asaas`
- Eventos recomendados: `PAYMENT_RECEIVED`, `PAYMENT_CONFIRMED`, `PAYMENT_OVERDUE`, `PAYMENT_REFUNDED`, `PAYMENT_DELETED`
- Envio sequencial: **ativado**
- Fila de sincronização: **ativada**

### Fluxo
1. Cliente adiciona produtos ao carrinho
2. No carrinho, clica em "Finalizar Compra"
3. Preenche nome, e-mail, CPF/CNPJ, telefone e escolhe forma de pagamento
4. `POST /api/checkout` cria cliente e cobrança no Asaas, salva pedido no MySQL
5. PIX: exibe QR code e copia/cola na página de sucesso
6. Boleto: abre link do boleto em nova aba
7. Cartão: redireciona para a tela de cartão do Asaas
8. Webhook atualiza status do pedido no MySQL

## Notas
- Typescript types do Supabase (`src/integrations/supabase/types.ts`) são parcialmente auto-gerados. Se rodar `supabase gen types`, sobrescrever — manter coluna `images` e tabela `orders` manualmente.
- `image_url` mantido como fallback para produtos existentes.
- Storefront usa `images` array se disponível, senão cai no `image_url`.
- Carrinho persiste em localStorage (chave `elegia-cart`).
