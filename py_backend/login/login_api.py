from flask import request, session
from flask_restful import Resource
from py_backend.login.User import Validation


class Login(Resource):

    def post(self):
        email = request.get_json()['formData']['email']
        password = request.get_json()['formData']['password']
        result = Validation(email, password).check()
        return result


