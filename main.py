from flask import Flask
from flask_security import Security, SQLAlchemyUserDatastore
from application.models import db, User, Role
from config import DevelopmentConfig
from application.api import api
from application.sec import datastore



def create_app():
    app = Flask(__name__) # Flask instance
    app.config.from_object(DevelopmentConfig) # Loading config
    db.init_app(app) # Initialize SQLAlchemy object
    api.init_app(app)
    app.security = Security(app, datastore)
    with app.app_context():
        import application.views

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)