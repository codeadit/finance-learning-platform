# app.py
from datetime import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_mongoengine import MongoEngine
from pymongo import MongoClient
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

# Define the User schema
class User(db.Document):
    username = db.StringField(required=True, unique=True)
    email = db.StringField(required=True)
    password = db.StringField(required=True)
    created_at = db.DateTimeField(default=datetime.utcnow)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Find user by username
    user = User.objects(username=username).first()
    
    hashed_password = generate_password_hash(password)
    if user:
        return jsonify({'message': 'User already exists', 'user': user.to_json()}), 200
    else:
        # Create new user
        new_user = User(
            username=username,
            email=email,
            password=hashed_password
        )
        new_user.save()
        return jsonify({'message': 'User created', 'user': new_user.to_json()}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # Find user by username
    user = User.objects(email=email).first()

    if user and check_password_hash(user['password'], password):
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

if __name__ == '__main__':
    app.run(debug=True, port=5005)