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
    return redirect(url_for("view_login"))

@app.route('/login', methods=["GET", "POST"])
def view_login():
    if request.method == "GET":
        return render_template('login.html')
    elif request.method == "POST":
        return login_user_endpoint()

def login_user_endpoint():
    from Models.Client.user import User
    
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"message": "Email e password são obrigatórios"}), 400

    try:
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.checkpw(str.encode(password), str.encode(user.password)):
            login_user(user)
            return jsonify({"message": "Autenticação realizada com sucesso"}) 
        
        return jsonify({"message": "Credenciais inválidas"}), 400

    except Exception as e:
        return jsonify({"message": "Erro interno do servidor"}), 500

@app.route('/register', methods=["GET", "POST"])
def view_register():
    if request.method == "GET":
        return render_template('register.html')
    elif request.method == "POST":
        return register_user_endpoint()

def register_user_endpoint():
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

        hashed_password = bcrypt.hashpw(str.encode(password), bcrypt.gensalt())
        new_user = User(email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "Usuário cadastrado com sucesso"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Erro ao cadastrar usuário"}), 500

@app.route('/dashboard')
@login_required
def dashboard():
    return jsonify({"message": f"Bem-vindo, {current_user.email}!"})

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('view_login'))

if __name__ == "__main__":
    with app.app_context():
        from Models.Client.user import User
        db.init_app(app)
        login_manager.init_app(app)
        db.create_all()
        db.session.commit()
    app.run(debug=True)