# app.py
from datetime import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_mongoengine import MongoEngine
from models import User, db
from pymongo import MongoClient
from routes_user import user_bp
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3001"}})  # Enable CORS for all routes and specify allowed origin

# Configure MongoDB settings
app.config['MONGODB_SETTINGS'] = {
    'db': 'user_db',
    'host': 'localhost',
    'port': 27017
}

# Initialize MongoEngine
db = MongoEngine()
db.init_app(app)

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/user')

@app.route('/')
def home():
    return "Welcome to the Home Page"

if __name__ == '__main__':
    app.run(debug=True, port=5005)