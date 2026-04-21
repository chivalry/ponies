import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev')
    app.config['UPLOAD_FOLDER'] = os.environ.get(
        'UPLOAD_FOLDER', 'src_back/uploads'
    )

    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)

    from src_back.api import routes  # noqa: F401

    app.register_blueprint(routes.bp)

    return app


app = create_app()
