📝 Descrição do Projeto
Este projeto é um aplicativo web desenvolvido com foco em otimizar o gerenciamento de promoções e operações de delivery para uma pizzaria, utilizando uma stack moderna e eficiente. 

🚀 Tecnologias Utilizadas
Next.js — Framework React para construção de aplicações web com SSR (Server Side Rendering) e SSG (Static Site Generation).

React — Biblioteca para construção de interfaces de usuário interativas e componentizadas.

TypeScript — Tipagem estática para maior segurança e produtividade no desenvolvimento.

Supabase — Backend as a Service (BaaS) utilizado para autenticação, armazenamento de arquivos e banco de dados.

Prisma ORM — Ferramenta para interação eficiente e segura com o banco de dados relacional.

✅ Status atual do MVP
O MVP (Minimum Viable Product) já conta com as seguintes funcionalidades implementadas:

HomePage — Landing page pública da pizzaria, apresentando a marca e principais informações.

Rota de promoções pública — Página de visualização de promoções (view), acessível sem autenticação.

API de promoções — CRUD completo de promoções implementado via Next.js API Routes.

Rotas administrativas (acesso restrito, exigem autenticação):

/clientes — Tela administrativa de listagem de clientes (pronta).

/clientes/[id] — Tela de visualização/edição de dados de um cliente específico (pronta).

/pedidos — Planejada, ainda não implementada.

/promos — Tela administrativa para editar promoções (em desenvolvimento, somente API pronta).

/promos/[id] — Tela administrativa de edição de uma promoção específica (em desenvolvimento, somente API pronta).

🔜 Próximos passos
Após a entrega do MVP, os próximos marcos do roadmap incluem:

Deploy da aplicação — Publicação da aplicação em ambiente de produção, utilizando serviços como Vercel .

Integração com Chat Bot — Desenvolvimento de um sistema automatizado de atendimento ao cliente, permitindo:

Consultas de promoções via WhatsApp.

Recebimento e atualização de status de pedidos.

Mapa de entregadores — Implementação de uma funcionalidade para visualizar em tempo real a localização dos entregadores, otimizando a logística e a comunicação com os clientes.

🎯 Objetivo final
Criar uma plataforma completa e escalável para a gestão de promoções, clientes e pedidos, automatizando processos internos, aprimorando a experiência do cliente e oferecendo uma solução eficiente para operações de delivery. Essa plataforma inicialmente será desenvolvida para a Benditta Pizza e posteriormente será replicada em uma versão redesenhada como um Saas.
