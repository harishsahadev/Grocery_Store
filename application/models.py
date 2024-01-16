from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=False, nullable=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    role_id = db.Column(db.String, db.ForeignKey('role.name'), nullable=False)
    roles = db.relationship('Role')

class Role(db.Model):
    __tablename__ = "role"
    # id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), primary_key=True)
    description = db.Column(db.String(255))

class Product(db.Model):
    __tablename__ = 'product'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    # category_id = db.Column(db.Integer, nullable=False)

class Category(db.Model):
    __tablename__ = 'category'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

class Cart(db.Model):
    __tablename__ = 'cart'
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

class Orders(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)