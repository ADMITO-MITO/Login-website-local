from Models.database import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.LargeBinary, nullable=False)  # Mudança aqui: LargeBinary para armazenar bytes

    def __init__(self, email, password, id=None):
        if id is not None:
            self.id = id
        self.email = email
        self.password = password

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
        }

    def __repr__(self):

        return f'<User {self.email}>'
