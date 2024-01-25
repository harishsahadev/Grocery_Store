from flask_restful import Resource, Api, reqparse, fields, marshal
from flask_security import auth_required, roles_required, roles_accepted, current_user
from sqlalchemy import or_
from .models import Category, db, Product, Cart
from flask import jsonify, request
import math

api = Api(prefix='/api')


parser = reqparse.RequestParser()
parser.add_argument('name', type=str, help='Name is required and should be a string', required=True)
parser.add_argument('description', type=str, help='Description should be a string', required=True)


# Custom field to return username instead of user object
class Creator(fields.Raw):
    def format(self, user):
        return user.email


category_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'is_approved': fields.Boolean,
    'creator': Creator,
}


class CategorySection(Resource):
    @auth_required('token')
    def get(self):
        if "admin" in current_user.roles:
            all_categories = Category.query.all() 
        else:
            all_categories = Category.query.filter(or_(Category.is_approved == True, Category.creator == current_user)).all()

        if current_user.active == False:
            return {"message": "Activation Pending"}, 403   ## HTTP 403 Forbidden response status code indicates that the server understands the request but refuses to authorize it
        
        if len(all_categories) == 0:
            return {"message": "No categories found"}, 404  ## HTTP 404 Not Found client error response code indicates that the server can't find the requested resource
        else:
            return marshal(all_categories, category_fields)

    
    @auth_required('token')
    # @roles_required(['admin', 'manager'])
    @roles_accepted('admin', 'manager')
    def post(self):
        args = parser.parse_args()

        category = Category.query.filter((Category.name == args.get('name'))).first()
        if category:
            return {"message": "Category already exists"}, 409  ## HTTP 409 Conflict response status code indicates a request conflict with current state of the server

        category = Category(creator_id=current_user.id, name=args.get('name'), description=args.get('description'))
        db.session.add(category)
        db.session.commit()
        return {"message": "Category added successfully"}
        
#-----------------xxxxxxxx---------------------#

# Custom field to return category name instead of user object
class Product_category(fields.Raw):
    def format(self, user):
        return user.name


product_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'cost': fields.Integer,
    'quantity': fields.Integer,
    'category': Product_category,
    # 'creator': Creator,
}


product_parser = reqparse.RequestParser()
product_parser.add_argument('name', type=str, help='Name is required and should be a string', required=True)
product_parser.add_argument('description', type=str, help='Description should be a string', required=True)
product_parser.add_argument('cost', type=int, help='Cost is required and should be an integer', required=True)
product_parser.add_argument('quantity', type=int, help='Quantity is required and should be an integer', required=True)
product_parser.add_argument('category', type=str, help='Category ID is required and should be a string', required=True)


class ProductSection(Resource):
    @auth_required('token')
    def get(self):
        all_products = Product.query.all()
        if len(all_products) == 0:
            return {"message": "No products found"}, 404
        else:
            return marshal(all_products, product_fields)
    

    @auth_required('token')
    @roles_accepted('admin', 'manager')
    def post(self):
        args = product_parser.parse_args()

        category = Category.query.filter_by(name=args.get('category')).first()
        # print(category)
        # print(category.id)
        if not category:
            return {"message": "Category not found"}, 404   ## HTTP 404 Not Found client error response code indicates that the server can't find the requested resource
        
        pdt = Product.query.filter((Product.cost == args.get('cost')) & (Product.name == args.get('name')) & (Product.product_category == category)).first()
        # print(pdt)
        if pdt:
            return {"message": "Product already exists"}, 409   ## HTTP 409 Conflict response status code indicates a request conflict with current state of the server
        
        if category.is_approved == False:
            return {"message": "Category not approved"}, 403    ## HTTP 403 Forbidden response status code indicates that the server understands the request but refuses to authorize it


        product = Product(creator_id=current_user.id, name=args.get('name'), description=args.get('description'), cost=args.get('cost'), quantity=args.get('quantity'),
                            category_id=category.id)
        db.session.add(product)
        db.session.commit()
        return {"message": "Product added successfully"}
    




#-------------------------------CART SECTION---------------------------#



# cart_fields = {
#     # "user_id": fields.Integer,
#     "product_id": fields.Integer,
#     "quantity": fields.Integer,
# }

cart_parser = reqparse.RequestParser()
cart_parser.add_argument('product_id', type=int, help='Product ID is required and should be an integer', required=True)
cart_parser.add_argument('quantity', type=int, help='Quantity is required and should be an integer', required=True)


class CartSection(Resource):

    # Custom serialization function to return product name instead of product object
    def serialize_cart_item(self, cart_item):
        return {
            'id': cart_item.id,
            'quantity': cart_item.quantity,
            'product_id': cart_item.product_id,
            'product_name': cart_item.product.name if cart_item.product else None,
            'product_cost': cart_item.product.cost if cart_item.product else None,
        }

    @auth_required('token')
    @roles_required('customer')
    def get(self):
        cart_items = Cart.query.filter_by(user_id=current_user.id).all()
        serialized_cart_items = [self.serialize_cart_item(item) for item in cart_items]

        print(serialized_cart_items)
        if len(cart_items) == 0:
            return {"message": "Cart is empty"}, 404    ## HTTP 404 Not Found client error response code indicates that the server can't find the requested resource
        else:
            return jsonify(serialized_cart_items)
    
    @auth_required('token')
    @roles_required('customer')
    def post(self):
        args = cart_parser.parse_args()

        quantity = math.floor(abs(args.get('quantity')))

        product = Product.query.filter(Product.id == args.get('product_id')).first()
        cart = Cart.query.filter((Cart.product_id == args.get('product_id')) & (Cart.user_id == current_user.id)).first()

        if cart:
            return {"message": "Product already in cart"}, 409   ## HTTP 409 Conflict response status code indicates a request conflict with current state of the server
        if not product:
            return {"message": "Product not found"}, 404    ## HTTP 404 Not Found client error response code indicates that the server can't find the requested resource
        if product.quantity <= 0:
            return {"message": "Product out of stock"}, 403  ## HTTP 403 Forbidden response status code indicates that the server understands the request but refuses to authorize it
        if product.quantity < quantity:
            return {"message": "Available quanity is less than requested quantity"}, 409   ## HTTP 409 Conflict response status code indicates a request conflict with current state of the server        
        
        # product.quantity -= quantity
        # db.session.commit()

        cart = Cart(user_id=current_user.id, product_id=args.get('product_id'), quantity=quantity)
        db.session.add(cart)
        db.session.commit()
        return {"message": "Product added to cart successfully"}







api.add_resource(CategorySection, '/category')
api.add_resource(ProductSection, '/product')
api.add_resource(CartSection, '/cart')