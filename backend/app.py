# app.py
from datetime import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (JWTManager, create_access_token,
                                get_jwt_identity, jwt_required)
from flask_mongoengine import MongoEngine
from jwt_setup import setup_jwt
from models import User, db
from pymongo import MongoClient
from routes_user import user_bp
from routes_courses import courses_bp
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Enable CORS for all routes and specify allowed origin

# Configure MongoDB settings
app.config['MONGODB_SETTINGS'] = {
    'db': 'user_db',
    'host': 'localhost',
    'port': 27017
}

# Initialize MongoEngine
db = MongoEngine()
db.init_app(app)
jwt = setup_jwt(app)

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/user')
app.register_blueprint(courses_bp, url_prefix='/courses')

@app.route('/')
def home():
    return "Welcome to the Home Page"

if __name__ == '__main__':
    app.run(debug=True, port=5005)