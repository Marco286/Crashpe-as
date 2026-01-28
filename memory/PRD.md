# CrashPeças - Product Requirements Document

## Resumo do Projeto
Site profissional para a CrashPeças, empresa especializada na venda de peças automóveis em Palmela, Portugal.

## Data de Criação
Dezembro 2025

---

## Problema Original
Criar um site moderno e responsivo para uma empresa de peças automóveis com:
- Loja/Catálogo de peças por categorias
- Sistema de solicitação de peças personalizado
- Contacto via WhatsApp
- Apresentação institucional

## Personas de Utilizador
1. **Cliente Particular** - Proprietário de carro que procura peças específicas
2. **Mecânico/Oficina** - Profissional que necessita de peças para reparações
3. **Administrador CrashPeças** - Recebe pedidos via WhatsApp

---

## Requisitos Core (Estáticos)

### Funcionalidades Principais
- [x] Homepage com hero, categorias e produtos em destaque
- [x] Loja com filtros por categoria e estado
- [x] Página de produto com detalhes e botões WhatsApp
- [x] Formulário "Solicitar Peça" com upload de imagem
- [x] Página "Sobre Nós" com missão/visão/valores
- [x] Página "Contactos" com mapa Google e formulário
- [x] Botão WhatsApp flutuante em todas as páginas
- [x] Integração WhatsApp para todos os formulários

### Stack Tecnológico
- Frontend: React + Tailwind CSS + Shadcn/UI
- Backend: FastAPI + Python
- Base de Dados: MongoDB
- Design: Tema escuro industrial (preto #0A0A0A, vermelho #DC2626)

---

## O que foi Implementado

### Backend (FastAPI)
- API REST completa com rotas /api
- Endpoints: categories, parts, part-requests, contacts
- Geração automática de links WhatsApp
- Dados de exemplo para demonstração
- Persistência de pedidos em MongoDB

### Frontend (React)
- 6 páginas completas (Home, Loja, Produto, Solicitar, Sobre, Contactos)
- Componentes reutilizáveis (Navbar, Footer, ProductCard, CategoryCard)
- Design responsivo mobile-first
- Animações e efeitos hover
- Integração completa com API
- Tema escuro consistente

### Data de Implementação
- MVP Completo: Dezembro 2025

---

## Backlog Priorizado

### P0 - Crítico (MVP) ✅
- [x] Estrutura do site completa
- [x] Todas as páginas funcionais
- [x] Integração WhatsApp

### P1 - Importante (Próxima Fase)
- [ ] Painel de administração para gerir pedidos
- [ ] Adicionar/editar produtos via interface
- [ ] Gestão de categorias dinâmica
- [ ] Newsletter com captura de emails

### P2 - Desejável (Futuro)
- [ ] Área de cliente com histórico de pedidos
- [ ] Sistema de avaliações/reviews
- [ ] Chat online em tempo real
- [ ] Integração com sistema de inventário
- [ ] SEO avançado e analytics

---

## Próximas Tarefas Sugeridas
1. Configurar número de WhatsApp real no backend
2. Adicionar mais produtos ao catálogo
3. Implementar painel de administração
4. Configurar domínio personalizado
