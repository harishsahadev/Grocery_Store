from flask import current_app as app, jsonify, request, render_template, send_file
from flask_security import auth_required, roles_required, roles_accepted, current_user
from flask_restful import marshal, fields
from sqlalchemy import desc, func
from .models import Orders, User, db, Category, Product, Cart
from .sec import datastore
from werkzeug.security import check_password_hash, generate_password_hash
import flask_excel as excel
from celery.result import AsyncResult
from .tasks import create_category_csv

@app.get('/')
def home():
    return render_template("index.html")


# @app.get('/admin')
# @auth_required('token')
# @roles_required('admin')
# def admin():
#     return "Welcome Admin"

@app.post('/user-register')
def register():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if not email:
        return jsonify({"message": 'email not provided'}), 400
    if not username:
        return jsonify({"message": 'username not provided'}), 400
    if not password:
        return jsonify({"message": 'password not provided'}), 400
    if not role:
        return jsonify({"message": 'role not provided'}), 400
    if role not in ['manager', 'customer']:
        return jsonify({"message": "Invalid role"}), 400
    
    user = datastore.find_user(email=email)
    if user:
        return jsonify({"message": "User already exists"}), 400
    
    if role == 'manager':
        user = datastore.create_user(username=username, email=email, password=generate_password_hash(password), roles=[role], active=False)
        db.session.commit()
        return jsonify({"message": "User created successfully, pending admin approval"}), 201
    
    else:
        user = datastore.create_user(username=username, email=email, password=generate_password_hash(password), roles=[role], active=True)
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201



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


@app.get('/category/<int:id>/approve>')
@auth_required('token')
@roles_required('admin')
def category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({"message": "Category not found"}), 404
    
    category.is_approved = True
    db.session.commit()
    return jsonify({"message": "Category approved"}), 200


product_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'cost': fields.Integer,
    'quantity': fields.Integer,
    # 'category': Product_category,
    # 'creator': Creator,
}



###  Get all products by category name

@app.get('/products/<cat_name>')
@auth_required('token')
def category_by_name(cat_name):
    category = Category.query.filter(Category.name == cat_name).all()
    # print(category)
    if not category:
        return jsonify({"message": "Category not found"}), 404
    
    product = Product.query.filter(Product.category_id == category[0].id).all()
    # print(product)
    if not product:
        return jsonify({"message": "No products found"}), 404
    
    return marshal(product, product_fields), 200



# Route to fetch and return approved categories for Product Form
@app.route('/get_approved_categories', methods=['GET'])
@auth_required('token')
@roles_accepted('admin', 'manager')
def get_approved_categories():
    try:
        # Fetch all names and ids of approved categories
        approved_categories = Category.query.filter_by(is_approved=True).with_entities(Category.id, Category.name).all()

        # Convert the result to a list of dictionaries for JSON serialization
        categories_data = [{'id': category.id, 'name': category.name} for category in approved_categories]

        return jsonify(categories_data), 200
    except Exception as e:
        return jsonify({'message': 'Something went wrong'}), 500
    

@app.route('/delete_cart/<int:cart_id>')
@auth_required('token')
@roles_required('customer')
def delete_cart(cart_id):
    cart = Cart.query.get(cart_id)
    cart = Cart.query.filter((Cart.id==cart_id) & (Cart.user_id==current_user.id)).first()
    if not cart:
        return jsonify({"message": "Cart item not found"}), 404
    
    db.session.delete(cart)
    db.session.commit()
    return jsonify({"message": "Cart item deleted"}), 200



def serialize_order_item(order_item):
    return {
        'id': order_item.id,
        'date': order_item.date.strftime('%Y-%m-%d %H:%M:%S IST'),
        'user_id': order_item.user_id,
        'product_id': order_item.product_id,
        'product_name': order_item.product.name if order_item.product else None,
        'product_cost': order_item.product.cost if order_item.product else None,
        'category_name': order_item.product.product_category.name if order_item.product else None,
        'quantity': order_item.quantity,
        # 'group_id': order_item.group_id,
    }


@app.route('/order_summary')
@auth_required('token')
@roles_required('customer')
def order_summary():
    last_group = db.session.query(func.max(Orders.group_id)).scalar()

    last_orders = Orders.query.filter_by(group_id=last_group).all()
    if len(last_orders) == 0:
        return jsonify({"message": "No orders found"}), 404
    
    serialized_orders = [serialize_order_item(item) for item in last_orders]

    return jsonify(serialized_orders), 200



@app.get('/download-csv')
def download_csv():
    task = create_category_csv.delay()
    return jsonify({"task_id": task.id}), 200




@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    # AsyncResult(task_id) is a celery function to get the result of a task asynchronously
    task = AsyncResult(task_id)

    if task.ready():
        return send_file(task.result, as_attachment=True)
    else:
        return jsonify({"message": "Task Pending"}), 404