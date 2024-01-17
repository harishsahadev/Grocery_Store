from main import app
from application.models import db, Role

with app.app_context():
    db.create_all()
    admin = Role(name='admin', description='Admin')
    db.session.add(admin)
    user = Role(name='user', description='User')
    db.session.add(user)
    manager = Role(name='manager', description='Manager')
    db.session.add(manager)
    try:
        db.session.commit()
    except:
        pass