from main import app
from application.sec import datastore
from application.models import db, Role
# from flask_security import hash_password
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    # Adding Roles
    datastore.find_or_create_role(name="admin", description="User is Admin")
    datastore.find_or_create_role(name="manager", description="User is Manager")
    datastore.find_or_create_role(name="customer", description="User is Customer")
    db.session.commit()

    # Adding users 
    if not datastore.find_user(email="admin@email.com"):
        datastore.create_user(username="admin", email="admin@email.com", password=generate_password_hash("admin"), roles=["admin"])
    if not datastore.find_user(email="manager1@email.com"):
        datastore.create_user(username="manager1", email="manager1@email.com", password=generate_password_hash("manager1"), roles=["manager"], active=False)
    if not datastore.find_user(email="cust1@email.com"):
        datastore.create_user(username="cust1", email="cust1@email.com", password=generate_password_hash("cust1"), roles=["customer"])
    db.session.commit()