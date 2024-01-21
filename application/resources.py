from flask_restful import Resource, Api, reqparse, fields, marshal_with
from flask_security import auth_required, roles_required, roles_accepted, current_user
from .models import Category, db

api = Api(prefix='/api')


parser = reqparse.RequestParser()
parser.add_argument('name', type=str, help='Name is required and should be a string', required=True)
parser.add_argument('description', type=str, help='Description should be a string', required=True)


category_fields = {
    # 'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    # 'is_approved': fields.Boolean
}


class CategorySection(Resource):
    @auth_required('token')
    @marshal_with(category_fields)
    def get(self):
        all_categories = Category.query.all()
        if len(all_categories) == 0:
            return {"message": "No categories found"}, 404  # won't return message because of marshal_with
        return all_categories
    
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