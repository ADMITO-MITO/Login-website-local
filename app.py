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

def login_autenticado():
    return render_template('register.html')
@app.route("/")
def index():
    return redirect(url_for("view_login"))

@app.route('/login', methods=["GET", "POST"])
def view_login():
    return render_template('login.html')
def Login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"message": "Email e password são obrigatórios"}), 400

    try:
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.checkpw(str.encode(password), str.encode(user.password)):
            login_user(user)
            return jsonify({"message": "Autenticação realizada com sucesso"}), login_autenticado()

        return jsonify({"message": "Credenciais inválidas"}), 400

    except Exception as e:
        return jsonify({"message": "Erro interno do servidor"}), 500

@app.route('/register', methods=["GET", "POST"])
def view_register():
    return render_template('register.html')
def register():
    pass

@app.route('/login-senha', methods=["GET", "PUT"])
def view_login_senha():
    return render_template('login') #mudar dps

if __name__ == "__main__":
    with app.app_context():
        from Models.Client.user import User
        db.init_app(app)
        login_manager.init_app(app)
        db.create_all()
        db.session.commit()
    app.run(debug=True)
