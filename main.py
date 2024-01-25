from flask import Flask
from flask_security import Security, SQLAlchemyUserDatastore
from application.models import db, User, Role
from config import DevelopmentConfig
from application.resources import api
from application.sec import datastore
from application.worker import celery_init_app
import flask_excel as excel
from celery.schedules import crontab
from application.tasks import monthly_report, daily_reminder
from application.cached_instance import cache



def create_app():
    app = Flask(__name__) # Flask instance
    app.config.from_object(DevelopmentConfig) # Loading config
    db.init_app(app) # Initialize SQLAlchemy object
    api.init_app(app)
    excel.init_excel(app)
    app.security = Security(app, datastore)
    cache.init_app(app)
    with app.app_context():
        import application.views

    return app



app = create_app()
celery_app = celery_init_app(app)

h, m = 18, 10

@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):

    # Monthly report at 8:00 PM on 28th of every month
    sender.add_periodic_task(
        # crontab(hour=20, minute=00, day_of_month=1),
        crontab(hour=h, minute=m),
        monthly_report.s(),
    )

    # Daily reminder at 6:30 PM
    sender.add_periodic_task(
        # crontab(hour=18, minute=30),
        crontab(hour=h, minute=m),
        daily_reminder.s(),
    )




if __name__ == "__main__":
    app.run(debug=True)