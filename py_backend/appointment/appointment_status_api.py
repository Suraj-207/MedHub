from flask import request
from flask_restful import Resource
import config
from py_backend.jwt_token.token import Token
from py_backend.appointment.appointment_status import BookCancelReschedule


class BookSlot(Resource):

    def post(self):
        try:
            token = request.get_json()['token']
            doctor_email = request.get_json()['doctor_email']
            issue = request.get_json()['issue']
            date = request.get_json()['date'] + " " + request.get_json()['time']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                patient_email = decoded['decoded_token']['email']
                return BookCancelReschedule().patient_book(patient_email, date, doctor_email, issue)
        except Exception as e:
            config.logger.log("ERROR", str(e))


class CancelSlot(Resource):

    def post(self):
        try:
            token = request.get_json()['token']
            doctor_email = request.get_json()['doctor_email']
            date = request.get_json()['date']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                # patient_email = decoded['decoded_token']['email']
                return BookCancelReschedule().patient_cancel(date, doctor_email)
        except Exception as e:
            config.logger.log("ERROR", str(e))


class TakeALeave(Resource):

    def post(self):
        try:
            token = request.get_json()['token']
            start = request.get_json()['start']
            end = request.get_json()['end']
            status = request.get_json()['status']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                doctor_email = decoded['decoded_token']['email']
                return BookCancelReschedule().doctor_leave(doctor_email, start, end, status)
        except Exception as e:
            config.logger.log("ERROR", str(e))
