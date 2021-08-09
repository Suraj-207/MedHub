from flask import request
from flask_restful import Resource
import config
from py_backend.appointment.fetch_and_filter import FetchFilter
from py_backend.jwt_token.token_validation_api import Token


class DoctorFetchUpcoming(Resource):

    def post(self):
        try:
            config.logger.log("INFO", "Fetching upcoming appointments")
            token = request.get_json()['token']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                email = decoded['decoded_token']['email']
                return FetchFilter().fetch_upcoming_appointment_by_doctor_email(email)
        except Exception as e:
            config.logger.log("ERROR", str(e))


class DoctorFilterUpcoming(Resource):

    def post(self):
        try:
            config.logger.log("INFO", "Filtering upcoming requests")
            token = request.get_json()['token']
            changes = request.get_json()['changes']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                email = decoded['decoded_token']['email']
                return FetchFilter().filter_upcoming_appointment_by_doctor_email(email, changes)
        except Exception as e:
            config.logger.log("ERROR", str(e))


class DoctorFetchPast(Resource):

    def post(self):
        try:
            config.logger.log("INFO", "Fetching past appointments")
            token = request.get_json()['token']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                email = decoded['decoded_token']['email']
                return FetchFilter().fetch_past_appointment_by_doctor_email(email)
        except Exception as e:
            config.logger.log("ERROR", str(e))


class DoctorFilterPast(Resource):

    def post(self):
        try:
            config.logger.log("INFO", "Filtering past appointments")
            token = request.get_json()['token']
            changes = request.get_json()['changes']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                email = decoded['decoded_token']['email']
                return FetchFilter().filter_past_appointment_by_doctor_email(email, changes)
        except Exception as e:
            config.logger.log("ERROR", str(e))


class PatientFetch(Resource):

    def post(self):
        try:
            config.logger.log("INFO", "Fetching appointments for patient")
            token = request.get_json()['token']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                email = decoded['decoded_token']['email']
                return FetchFilter().fetch_filter_doctor_info_from_patient_email(email)
        except Exception as e:
            config.logger.log("ERROR", str(e))


class PatientFilter(Resource):

    def post(self):
        try:
            config.logger.log("INFO", "Filtering appointments for patient")
            token = request.get_json()['token']
            changes = request.get_json()['changes']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                email = decoded['decoded_token']['email']
                return FetchFilter().fetch_filter_doctor_info_from_patient_email(email, changes)
        except Exception as e:
            config.logger.log("ERROR", str(e))


class FetchNAAppointments(Resource):

    def post(self):
        try:
            config.logger.log("INFO", "Fetching open appointments...")
            doctor_email = request.get_json()['email']
            token = request.get_json()['token']
            date = request.get_json()['date']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                patient_email = decoded['decoded_token']['email']
                return FetchFilter().fetch_na_appointments(doctor_email, patient_email, date)
        except Exception as e:
            config.logger.log("ERROR", str(e))


class FetchDoctors(Resource):

    def post(self):
        try:
            config.logger.log("INFO", "Fetching doctors as per patient requirements")
            token = request.get_json()['token']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                email = decoded['decoded_token']['email']
                if 'longitude' in list(request.get_json().keys()):
                    longitude = request.get_json()['longitude']
                    latitude = request.get_json()['latitude']
                    return FetchFilter().fetch_filter_doctors(patient_email=email, longitude=longitude, latitude=latitude)
                else:
                    return FetchFilter().fetch_filter_doctors(patient_email=email)
        except Exception as e:
            config.logger.log("ERROR", str(e))


class FilterDoctors(Resource):

    def post(self):
        try:
            config.logger.log("INFO", "Fetching doctors as per patient requirements")
            token = request.get_json()['token']
            city = request.get_json()['city'].capitalize()
            state = request.get_json()['state'].capitalize()
            speciality = request.get_json()['speciality']
            decoded = Token().validate_token(token)
            if decoded['valid']:
                email = decoded['decoded_token']['email']
                return FetchFilter().fetch_filter_doctors(patient_email=email, city=city, state=state, speciality=speciality)
        except Exception as e:
            config.logger.log("ERROR", str(e))
