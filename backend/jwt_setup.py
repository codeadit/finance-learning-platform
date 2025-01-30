# jwt_setup.py
from flask_jwt_extended import JWTManager

def setup_jwt(app):
    app.config['JWT_SECRET_KEY'] = 'e5b8f8e9d4f8e2a1b6c8d9e7f4a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0'  # Replace with your generated key
    jwt = JWTManager(app)
    return jwt