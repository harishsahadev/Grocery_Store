from flask import Flask
from application.models import db
from config import DevelopmentConfig



def create_app():
    app = Flask(__name__) # Flask instance
    app.config.from_object(DevelopmentConfig) # Loading config
    db.init_app(app) # Initialize SQLAlchemy object
    with app.app_context():
        import application.views
    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)