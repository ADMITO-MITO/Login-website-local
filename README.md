# 🔐 Login Website Local

Sistema de autenticação fullstack com interface web interativa, construído com Flask, Flask-Login, bcrypt e SQLite. Inclui dashboard do usuário com edição de perfil, alteração de senha e exclusão de conta.

---

## 🧰 Tecnologias

- Python 3 + Flask
- Flask-Login (gerenciamento de sessão)
- Flask-SQLAlchemy + SQLite
- bcrypt (hash de senhas)
- Jinja2 (templates HTML)
- HTML, CSS e JavaScript vanilla

---

## 🚀 Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/ADMITO-MITO/Login-website-local.git
cd Login-website-local
```

### 2. Crie e ative o ambiente virtual

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Instale as dependências

```bash
pip install -r requirements.txt
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
SECRET_KEY=sua_chave_secreta
```

### 5. Rode a aplicação

```bash
python app.py
```

A aplicação estará disponível em `http://localhost:5000`. O banco de dados SQLite é criado automaticamente na primeira execução.

---

## 📬 Rotas

### Páginas

| Método | Rota         | Descrição                        |
|--------|--------------|----------------------------------|
| GET    | `/`          | Redireciona para login           |
| GET    | `/login`     | Página de login                  |
| GET    | `/register`  | Página de cadastro               |
| GET    | `/dashboard` | Dashboard do usuário (protegida) |
| GET    | `/logout`    | Encerra sessão e redireciona     |

### API

| Método | Rota               | Descrição                          | Auth necessária |
|--------|--------------------|------------------------------------|-----------------|
| POST   | `/api/login`       | Autentica o usuário                | ❌              |
| POST   | `/api/register`    | Cadastra novo usuário              | ❌              |
| GET    | `/api/user`        | Retorna dados do usuário logado    | ✅              |
| PUT    | `/api/user/update` | Atualiza email ou senha            | ✅              |
| DELETE | `/api/user/delete` | Deleta a conta do usuário          | ✅              |

---

## 🖥️ Funcionalidades do Dashboard

- Visualização dos dados da conta
- Edição de email e senha
- Exclusão de conta com confirmação por senha
- Atalhos de teclado: `Ctrl+S` para salvar, `ESC` para fechar modal
- Exportação dos dados em JSON

---

## 📁 Estrutura do projeto

```
├── app.py
├── Models/
│   ├── database.py
│   ├── login_manager.py
│   └── Client/
│       └── user.py
├── templates/
│   ├── login.html
│   ├── register.html
│   └── dashboard.html
├── static/
│   ├── style.css
│   ├── register_style.css
│   ├── dashboard.css
│   ├── dashboard.js
│   ├── scrip.js
│   └── image/
├── requirements.txt
└── .env.example
```

---

## 📌 Melhorias futuras

- [ ] Autenticação com JWT
- [ ] Migração para PostgreSQL ou MySQL
- [ ] Testes automatizados
- [ ] Deploy em nuvem