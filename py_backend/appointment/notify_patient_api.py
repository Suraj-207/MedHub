from flask import request
from flask_restful import Resource
import config
from py_backend.jwt_token.token import Token
from py_backend.appointment.notify import Notification


class NotifyPatient(Resource):

    def post(self):
        try:
            token = request.get_json()['token']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                patient_email = decoded['decoded_token']['email']
                return Notification().fetch_notification(patient_email)
        except Exception as e:
            config.logger.log("ERROR", str(e))
