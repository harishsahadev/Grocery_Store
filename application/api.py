from flask_restful import Resource, Api

api = Api(prefix='/api')

class TestApi(Resource):
    def get(self):
        return {"message": "hello from api"}
    


api.add_resource(TestApi, '/')