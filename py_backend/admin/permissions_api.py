from flask import request
from flask_restful import Resource
import config
from py_backend.jwt_token.token import Token
from py_backend.admin.permissions import Admin


class AdminFetch(Resource):

    def post(self):
        try:
            token = request.get_json()['token']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                return Admin().show_all_inactive_doctor_status()
        except Exception as e:
            config.logger.log("ERROR", str(e))


class AdminChange(Resource):

    def post(self):
        try:
            token = request.get_json()['token']
            email = request.get_json()['email']
            acc_id = request.get_json()['acc_id']
            active = request.get_json()['active']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                return Admin().give_permission(email, acc_id, active)
        except Exception as e:
            config.logger.log("ERROR", str(e))
