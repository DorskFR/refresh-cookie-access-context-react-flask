from flask.cli import FlaskGroup
from app import app, db, User
from datetime import datetime
from werkzeug.security import generate_password_hash


cli = FlaskGroup(app)


@cli.command("reset_db")
def reset_db():
    db.drop_all()
    db.create_all()
    db.session.commit()
    print("Database reset.")


@cli.command("create_admin")
def create_admin():
    created = datetime.utcnow()
    admin = User(
        username="admin",
        email="admin@admin",
        role="admin",
        password=generate_password_hash("password"),
        created=created,
    )
    db.session.add(admin)
    db.session.commit()
    print("Admin created.")


if __name__ == "__main__":
    cli()
