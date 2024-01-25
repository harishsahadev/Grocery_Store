from flask import Flask
from flask_security import Security, SQLAlchemyUserDatastore
from application.models import db, User, Role
from config import DevelopmentConfig
from application.resources import api
from application.sec import datastore
from application.worker import celery_init_app
import flask_excel as excel
from celery.schedules import crontab
from application.tasks import monthly_report



def create_app():
    app = Flask(__name__) # Flask instance
    app.config.from_object(DevelopmentConfig) # Loading config
    db.init_app(app) # Initialize SQLAlchemy object
    api.init_app(app)
    excel.init_excel(app)
    app.security = Security(app, datastore)
    with app.app_context():
        import application.views

    return app

app = create_app()
celery_app = celery_init_app(app)

@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        # crontab(hour=14, minute=54, day_of_month=25),
        crontab(hour=16, minute=57),
        monthly_report.s(),
    )

if __name__ == "__main__":
    app.run(debug=True)