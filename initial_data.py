from main import app
from application.sec import datastore
from application.models import db, Role, Category, Cart, Product
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
    # Admin
    if not datastore.find_user(email="admin@email.com"):
        datastore.create_user(username="admin", email="admin@email.com", password=generate_password_hash("admin"), roles=["admin"])

    # Managers
    if not datastore.find_user(email="manager1@email.com"):
        datastore.create_user(username="manager1", email="manager1@email.com", password=generate_password_hash("manager1"), roles=["manager"], active=True)
    if not datastore.find_user(email="manager2@email.com"):
        datastore.create_user(username="manager2", email="manager2@email.com", password=generate_password_hash("manager2"), roles=["manager"], active=False)

    # Customers
    if not datastore.find_user(email="cust1@email.com"):
        datastore.create_user(username="cust1", email="cust1@email.com", password=generate_password_hash("cust1"), roles=["customer"])
    if not datastore.find_user(email="cust2@email.com"):
        datastore.create_user(username="cust2", email="cust2@email.com", password=generate_password_hash("cust2"), roles=["customer"])
    db.session.commit()

    # Adding categories
    if not Category.query.filter_by(name="Fruits").first():
        category = Category(name="Fruits", description="Fruits", is_approved=True, creator_id=1)
        db.session.add(category)
    if not Category.query.filter_by(name="Vegetables").first():
        category = Category(name="Vegetables", description="Vegetables", is_approved=True, creator_id=1)
        db.session.add(category)
    db.session.commit()

    # Adding products
    if not Product.query.filter_by(name="Apple").first():
        product = Product(name="Apple", description="Apple", cost=10, quantity=100, category_id=1, creator_id=2)
        db.session.add(product)
    if not Product.query.filter_by(name="Potato").first():
        product = Product(name="Potato", description="Potato", cost=10, quantity=100, category_id=2, creator_id=1)
        db.session.add(product)
    db.session.commit()

    # Adding cart items
    if not Cart.query.filter_by(user_id=4).first():
        cart = Cart(user_id=4, product_id=1, quantity=10)
        db.session.add(cart)
    if not Cart.query.filter_by(user_id=5).first():
        cart = Cart(user_id=5, product_id=2, quantity=10)
        db.session.add(cart)
    db.session.commit()