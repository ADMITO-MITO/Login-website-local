from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_login import login_required, login_user, current_user, logout_user
import bcrypt

app = Flask(__name__)
app.config["SECRET_KEY"] = "YOUR_SECRET_KEY"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"

from Models.database import db
from Models.login_manager import login_manager

@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"error": "Login obrigatório"}), 401

@login_manager.user_loader
def load_user(user_id):
    from Models.Client.user import User
    return db.session.get(User, int(user_id))

@app.route("/")
def index():
    return redirect(url_for("login_page"))

@app.route('/login', methods=["GET"])
def login_page():
    return render_template('login.html')

@app.route('/api/login', methods=["POST"])
def login_api():
    from Models.Client.user import User


    if not request.is_json:
        return jsonify({"message": "Content-Type deve ser application/json"}), 400

    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email e password são obrigatórios"}), 400

    try:

        user = User.query.filter_by(email=email).first()
        print(f"DEBUG: Usuário encontrado: {user}")

        if not user:
            return jsonify({"message": "Credenciais inválidas"}), 400

        print(f"DEBUG: Senha do banco: {user.password}")
        print(f"DEBUG: Tipo da senha do banco: {type(user.password)}")

        if isinstance(user.password, bytes):
            stored_password = user.password
        else:
            stored_password = user.password.encode('utf-8')

        password_bytes = password.encode('utf-8')

        print(f"DEBUG: Verificando senha...")

        if bcrypt.checkpw(password_bytes, stored_password):
            login_user(user)
            print(f"DEBUG: Login bem-sucedido para {email}")
            return jsonify({"message": "Autenticação realizada com sucesso"})
        else:
            print(f"DEBUG: Senha incorreta para {email}")
            return jsonify({"message": "Credenciais inválidas"}), 400

    except Exception as e:
        print(f"ERRO no login: {str(e)}")
        print(f"Tipo do erro: {type(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"message": f"Erro interno do servidor: {str(e)}"}), 500

@app.route('/register', methods=["GET"])
def register_page():
    return render_template('register.html')

@app.route('/api/register', methods=["POST"])
def register_api():
    from Models.Client.user import User

    if not request.is_json:
        return jsonify({"message": "Content-Type deve ser application/json"}), 400

    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email e password são obrigatórios"}), 400

    if not email.strip() or not password.strip():
        return jsonify({"message": "Email e password não podem ser vazios"}), 400

    try:
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"message": "Usuário já existe"}), 400

        password_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password_bytes, salt)

        print(f"DEBUG REGISTRO: Senha original: {password}")
        print(f"DEBUG REGISTRO: Hash gerado: {hashed_password}")
        print(f"DEBUG REGISTRO: Tipo do hash: {type(hashed_password)}")

        new_user = User(email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        print(f"DEBUG REGISTRO: Usuário {email} criado com sucesso")

        return jsonify({"message": "Usuário cadastrado com sucesso"}), 201

    except Exception as e:
        db.session.rollback()
        print(f"ERRO no registro: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"message": f"Erro ao cadastrar usuário: {str(e)}"}), 500

@app.route('/dashboard')
@login_required
def dashboard():
    return jsonify({
        "message": f"Bem-vindo, {current_user.email}!",
        "user": current_user.to_dict()
    })

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login_page'))

if __name__ == "__main__":
    with app.app_context():
        from Models.Client.user import User
        db.init_app(app)
        login_manager.init_app(app)
        db.create_all()
        db.session.commit()
    app.run(debug=True)
