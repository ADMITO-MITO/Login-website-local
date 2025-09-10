from Models.database import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    def __init__(self, id, email, password):
        self.id = id
        self.email = email
        self.password = password
    
    def to_dict(self):
        return{
            "id": self.id, 
            "email": self.email, 
        }