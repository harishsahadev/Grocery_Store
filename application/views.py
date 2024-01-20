from flask import current_app as app, jsonify, request, render_template
from flask_security import auth_required, roles_required
from flask_restful import marshal, fields
from .models import User, db
from .sec import datastore
from werkzeug.security import check_password_hash


@app.get('/')
def home():
    return render_template("index.html")


@app.get('/admin')
@auth_required('token')
@roles_required('admin')
def admin():
    return "Welcome Admin"


@app.get('/activate/manager/<int:manager_id>')
@auth_required('token')
@roles_required('admin')
def manager_activation(manager_id):
    manager = User.query.get(manager_id)
    if not manager:
        return jsonify({"message": "Manager not found"}), 404
    
    manager.active = True
    db.session.commit()
    return jsonify({"message": "User Activated"})


@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": 'email not provided'}), 400
    
    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "User not found"}), 404
    
    if check_password_hash(user.password, data.get("password")):
        return jsonify({"token": user.get_auth_token(), "username": user.username,  "email": user.email, "role": user.roles[0].name})
    else:
        return jsonify({"message": "Incorrect credentials"}), 400
    

user_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'email': fields.String,
    'active': fields.Boolean,
}

@app.get('/users')
@auth_required('token')
@roles_required('admin')
def all_users():
    users = User.query.all()
    if len(users) == 0:
        return jsonify({"message": "No users found"}), 404
    return marshal(users, user_fields), 200