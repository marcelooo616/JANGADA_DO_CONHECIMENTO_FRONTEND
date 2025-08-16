# Jangada do Conhecimento - Frontend 🚢

Bem-vindo ao repositório do front-end da **Jangada do Conhecimento**, uma plataforma interna de base de conhecimento projetada para equipes de suporte técnico. Esta aplicação foi construída com **React** e **Vite**, focando em performance, usabilidade e uma experiência de usuário moderna.

![Screenshot da Aplicação](https://i.imgur.com/Wze8OUY.png)  


##  Funcionalidades

- **Autenticação Segura**: Sistema de Login e Cadastro com tokens JWT.
- **Base de Conhecimento**: Página principal para visualização de todos os artigos, com busca "live" (com debounce), filtro por categorias e paginação.
- **Editor de Texto Avançado**: Um editor de texto rico ("WYSIWYG") construído com Lexical, permitindo formatação complexa, criação de listas, citações, blocos de código e upload de imagens.
- **Painel de Administração**: Uma área de dashboard completa para gerenciamento da plataforma, incluindo:
  - **Gerenciamento de Usuários**: Listagem de todos os usuários, com a capacidade de ativar/desativar suas contas.
  - **Gerenciamento de Categorias**: Interface CRUD (Criar, Ler, Atualizar, Deletar) para as categorias dos artigos, com validação de segurança para exclusão.
- **Design Responsivo**: Interface adaptada para funcionar em desktops, tablets e dispositivos móveis.
- **Deploy Contínuo**: Integrado com a Vercel para deploys automáticos a cada push na branch main.

##  Tecnologias Utilizadas

- **Framework**: React
- **Build Tool**: Vite
- **Roteamento**: React Router DOM
- **Cliente HTTP**: Axios
- **Gerenciamento de Estado de Servidor (Caching/Fetching)**: TanStack (React) Query
- **Editor de Texto Rico**: Lexical
- **Notificações**: React Toastify
- **Ícones**: Font Awesome & React Icons
- **Hospedagem**: Vercel

##  Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e rodar a aplicação em seu ambiente de desenvolvimento:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/jangada-do-conhecimento-frontend.git
   ```

2. **Navegue até a pasta do projeto**:
   ```bash
   cd jangada-do-conhecimento-frontend
   ```

3. **Instale as dependências**:
   ```bash
   npm install
   ```

4. **Configure as Variáveis de Ambiente**:
   Crie um arquivo chamado `.env` na raiz do projeto e adicione a seguinte variável para conectar o front-end à sua API local:
   ```plaintext
   VITE_API_URL=http://localhost:3000/api
   ```

5. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em [http://localhost:5173](http://localhost:5173) (ou outra porta indicada no terminal).

##  Variáveis de Ambiente

Para rodar o projeto, a seguinte variável de ambiente é necessária no arquivo `.env`:

| Variável       | Descrição                                      | Exemplo (Desenvolvimento)          |
|----------------|------------------------------------------------|------------------------------------|
| `VITE_API_URL` | A URL base da sua API back-end.               | `http://localhost:3000/api`       |

Para produção, esta variável deve ser configurada no painel da Vercel com a URL da sua API pública.

##  Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a versão de produção otimizada do site na pasta `dist`.
- `npm run preview`: Inicia um servidor local para visualizar a versão de produção gerada pelo build.

##  Estrutura de Pastas (Simplificada)

```
/src
├── /api           # Configuração central do Axios
├── /assets        # Imagens estáticas, logos, etc.
├── /components    # Componentes reutilizáveis (Navbar, Cards, Modais, etc.)
│   └── /admin     # Componentes específicos do dashboard admin
├── /context       # Contexto de Autenticação (AuthContext)
├── /editor        # Lógica do editor Lexical (nós, plugins)
├── /hooks         # Hooks customizados (ex: useDebounce)
└── /pages         # Componentes de página (HomePage, LoginPage, Admin, etc.)
    └── /admin     # Páginas específicas do dashboard admin
```

##  Deploy

Este projeto está configurado para deploy contínuo na Vercel. Qualquer push na branch main irá automaticamente disparar um novo build e deploy da aplicação.

---

Sinta-se à vontade para ajustar qualquer parte do texto conforme necessário!
