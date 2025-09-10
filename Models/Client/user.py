from Models.database import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    def __init__(self, email, password, id=None):
        """
        Construtor da classe User.
        
        Args:
            email (str): Email do usuário
            password (str): Senha hash do usuário
            id (int, optional): ID do usuário. Se None, será gerado automaticamente pelo banco
        """
        if id is not None:
            self.id = id
        self.email = email
        self.password = password
    
    def to_dict(self):
        """
        Converte o objeto User para dicionário (útil para APIs JSON).
        
        Returns:
            dict: Dicionário com os dados do usuário (sem a senha)
        """
        return {
            "id": self.id, 
            "email": self.email, 
        }
    
    def __repr__(self):
        """
        Representação string do objeto User (útil para debug).
        
        Returns:
            str: Representação do usuário
        """
        return f'<User {self.email}>'