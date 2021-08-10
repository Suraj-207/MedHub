from flask import request
from flask_restful import Resource
import config
from py_backend.jwt_token.token import Token
from py_backend.appointment.appointment_status import BookCancelReschedule
from py_backend.payments.razorpay import Payment
import threading


class ConfirmPayment(Resource):

    def get(self):
        try:
            pay_id = request.args.get("razorpay_payment_id")
            payment = Payment()
            notes = payment.get_notes_from_pay_id(pay_id)
            acc_id = 'acc_HiislGOtj2ztgi'
            payment.transfer(acc_id, pay_id)
            return BookCancelReschedule().patient_book_confirm(notes['patient_email'], notes['date'], notes['doctor_email'], pay_id)
        except Exception as e:
            config.logger.log("ERROR", str(e))


class BookSlot(Resource):

    def post(self):
        try:
            token = request.get_json()['token']
            doctor_email = request.get_json()['doctor_email']
            issue = request.get_json()['issue']
            date = request.get_json()['date'] + "T" + request.get_json()['time']
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
                result = BookCancelReschedule().patient_cancel(date, doctor_email)
                if result:
                    pay_id_fetch_query = "select pay_id from medhub.appointment where doctor_email = '" + doctor_email + "' and start = '" + date + "' allow filtering"
                    pay_id_fetch = config.cassandra.session.execute(pay_id_fetch_query).one()
                    Payment().refund(pay_id_fetch.pay_id)
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
                threading.Thread(target=BookCancelReschedule().doctor_leave,
                                 args=(doctor_email, start, end, status)).start()
                return True
        except Exception as e:
            config.logger.log("ERROR", str(e))


class DoctorComplete(Resource):

    def post(self):
        try:
            token = request.get_json()['token']
            date = request.get_json()['date']
            diagnosis = request.get_json()['diagnosis']
            prescription = request.get_json()['prescription']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                doctor_email = decoded['decoded_token']['email']
                return BookCancelReschedule().doctor_complete(doctor_email, date, diagnosis, prescription)
        except Exception as e:
            config.logger.log("ERROR", str(e))


