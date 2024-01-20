from flask import current_app as app, jsonify
from flask_security import auth_required, roles_required
from .models import User, db


@app.get('/')
def home():
    return "project start"


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