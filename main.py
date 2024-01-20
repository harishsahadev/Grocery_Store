from flask import Flask
from flask_security import Security, SQLAlchemyUserDatastore
from application.models import db, User, Role
from config import DevelopmentConfig
from application.api import api



def create_app():
    app = Flask(__name__) # Flask instance
    app.config.from_object(DevelopmentConfig) # Loading config
    db.init_app(app) # Initialize SQLAlchemy object
    api.init_app(app)
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore)
    with app.app_context():
        import application.views

    return app, datastore

app, datastore = create_app()

if __name__ == "__main__":
    app.run(debug=True)