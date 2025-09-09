from flask import Flask, request, jsonify, render_template
import uuid

app = Flask(__name__)
app.config["SECRET_KEY"] = "YOUR_SECRET_KEY"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
from Models.database import db
from Models.login_manager import login_manager


@app.route('/login', methods=["GET"])
def Login():
    return render_template("index.html")

if __name__ == "__main__":
    with app.app_context():
        from Models.Client.user import User
        db.init_app(app)
        login_manager.init_app(app)
        db.create_all()
        db.session.commit()
    app.run(debug=True)