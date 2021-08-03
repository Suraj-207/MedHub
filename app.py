import os
import config
from py_backend.logger.log_db import Logger
from flask import Flask, send_from_directory
from flask_restful import Api
from flask_cors import CORS
from py_backend.cassandra_db.crud import Operations
from py_backend.login.login_api import Login
from py_backend.signup.signup_api import Signup


app = Flask(__name__, static_url_path='', static_folder='/frontend/build')
CORS(app)
config.logger = Logger()
config.cassandra = Operations(config.logger)
api = Api(app)


@app.route('/', defaults={'path': ''})
def home_page(path):
    return send_from_directory(app.static_folder,'index.html')


api.add_resource(Login, '/api/login')
api.add_resource(Signup, '/api/signup')


if __name__ == '__main__':
    config.logger.log("INFO", "App starting...")
    port = int(os.environ.get('PORT', 5000))
    app.run(host='127.0.0.1', port=port, debug=True)
