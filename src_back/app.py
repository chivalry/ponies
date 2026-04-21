import os

from dotenv import load_dotenv
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    static_folder = os.path.abspath('dist/public')
    app = Flask(__name__, static_folder=static_folder, static_url_path='')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev')
    app.config['UPLOAD_FOLDER'] = os.environ.get(
        'UPLOAD_FOLDER', 'src_back/uploads'
    )

    CORS(app)
    db.init_app(app)

    import src_back.models  # noqa: F401 — register models with SQLAlchemy

    migrate.init_app(app, db)

    from src_back.api import routes

    app.register_blueprint(routes.bp)

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if path.startswith('api/'):
            return {'error': 'Not found'}, 404
        full = os.path.join(static_folder, path)
        if path and os.path.exists(full):
            return send_from_directory(static_folder, path)
        return send_from_directory(static_folder, 'index.html')

    return app


app = create_app()
