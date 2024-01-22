from flask_restful import Resource, Api, reqparse, fields, marshal
from flask_security import auth_required, roles_required, roles_accepted, current_user
from sqlalchemy import or_
from .models import Category, db

api = Api(prefix='/api')


parser = reqparse.RequestParser()
parser.add_argument('name', type=str, help='Name is required and should be a string', required=True)
parser.add_argument('description', type=str, help='Description should be a string', required=True)


# Custom field to return username instead of user object
class Creator(fields.Raw):
    def format(self, user):
        return user.email


category_fields = {
    # 'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'is_approved': fields.Boolean,
    'creator': Creator(attribute='creator'),
}


class CategorySection(Resource):
    @auth_required('token')
    def get(self):
        if "admin" in current_user.roles:
            all_categories = Category.query.all() 
        else:
            all_categories = Category.query.filter(or_(Category.is_approved == True, Category.creator == current_user)).all()
        
        if len(all_categories) == 0:
            return {"message": "No categories found"}, 404
        else:
            return marshal(all_categories, category_fields)

    
    @auth_required('token')
    # @roles_required(['admin', 'manager'])
    @roles_accepted('admin', 'manager')
    def post(self):
        args = parser.parse_args()
        category = Category(creator_id=current_user.id, name=args.get('name'), description=args.get('description'))
        db.session.add(category)
        db.session.commit()
        return {"message": "Category added successfully"}
        


api.add_resource(CategorySection, '/category')