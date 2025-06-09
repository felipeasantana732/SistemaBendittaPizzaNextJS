📝 Descrição do Projeto
Este projeto é um aplicativo web desenvolvido com foco em otimizar o gerenciamento de promoções e operações de delivery para uma pizzaria, utilizando uma stack moderna e eficiente. 

🚀 Tecnologias Utilizadas
Next.js — Framework React para construção de aplicações web com SSR (Server Side Rendering) e SSG (Static Site Generation).

React — Biblioteca para construção de interfaces de usuário interativas e componentizadas.

TypeScript — Tipagem estática para maior segurança e produtividade no desenvolvimento.

Supabase — Utilizado para autenticação, armazenamento de arquivos e banco de dados.

Prisma ORM — Ferramenta para interação com o banco de dados relacional.

✅ Status atual do MVP
O MVP (Minimum Viable Product) já conta com as seguintes funcionalidades implementadas:

HomePage — Landing page pública da pizzaria, apresentando a marca e principais informações.

Rota de promoções pública — Página de visualização de promoções (view), acessível sem autenticação.

API de promoções — Retorna todas as promoções disponiveis. (Alimenta as rotas publicas de promos do front)

Rotas administrativas (acesso restrito, exigem autenticação):
/usuarios - Tela Administrativa para listar usuários administrativos e suas roles (em desenvolvimento).
/usuarios/[id] - Tela Administrativa para editar as roles e enviar convites para inserir novos usuários administrativos (em desenvolvimento).

/promos — Tela administrativa para editar promoções (em desenvolvimento, somente API pronta).
/promos/add — Tela administrativa para editar promoções (em desenvolvimento, somente API pronta).

/promos/[id] — Tela administrativa de Visualização de uma promoção específica (em desenvolvimento, somente API pronta).
/promos/[id]/edit — Tela administrativa de edição de uma promoção específica (em desenvolvimento, Proxima Feature que será desenvolvida).

🔜 Próximos passos

Integração com Chat Bot — Integração do sistema com WhatsApp, Bot irá fazer todas as consultas de informações via Wpp, postar as informações diretamente para minha Api.

Recebimento e atualização de status de pedidos Via WhatsApp.

Mapa de entregadores — Implementação de uma funcionalidade para visualizar em tempo real a localização dos entregadores, otimizando a logística e a comunicação com os clientes. 

🎯 Objetivo final
Criar uma plataforma completa e escalável para a gestão de promoções, clientes e pedidos, automatizando processos internos, aprimorando a experiência do cliente e oferecendo uma solução eficiente para operações de delivery. Essa plataforma inicialmente será desenvolvida para a Benditta Pizza e posteriormente será replicada em uma versão redesenhada como um Saas.
