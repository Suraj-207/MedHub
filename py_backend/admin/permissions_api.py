from flask import request
from flask_restful import Resource
import config
from py_backend.jwt_token.token import Token
from py_backend.admin.permissions import Admin


class AdminFetchInactive(Resource):

    def post(self):
        try:
            token = request.get_json()['token']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                return Admin().show_all_inactive_doctor_status()
        except Exception as e:
            config.logger.log("ERROR", str(e))


class AdminChangeInactive(Resource):

    def post(self):
        try:
            token = request.get_json()['token']
            email = request.get_json()['email']
            acc_id = request.get_json()['acc_id']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                return Admin().give_permission(email, acc_id)
        except Exception as e:
            config.logger.log("ERROR", str(e))


class AdminFetchActive(Resource):

    def post(self):
        try:
            token = request.get_json()['token']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                return Admin().show_all_active_doctor_status()
        except Exception as e:
            config.logger.log("ERROR", str(e))


class AdminChangeActive(Resource):

    def post(self):
        try:
            token = request.get_json()['token']
            email = request.get_json()['email']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                return Admin().halt_permission(email)
        except Exception as e:
            config.logger.log("ERROR", str(e))
