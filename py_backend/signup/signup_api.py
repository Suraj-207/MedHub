from py_backend.signup.signup_user import Registration
from flask_restful import Resource
from flask import request


class Signup(Resource):

    def post(self):
        record = request.get_json()['formData']
        print(record)
        return Registration(record)
