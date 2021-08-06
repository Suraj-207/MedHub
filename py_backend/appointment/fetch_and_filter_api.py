from flask import request
from flask_restful import Resource
import config
from py_backend.appointment.fetch_and_filter import FetchFilterAppointment


class DoctorFetchUpcoming(Resource):

    def post(self):
        try:
            config.logger.log("INFO", "Fetching upcoming appointments")
            email = request.get_json()['email']
            return FetchFilterAppointment().fetch_upcoming_appointment_by_doctor_email(email)
        except Exception as e:
            config.logger.log("ERROR", str(e))


class DoctorFilterUpcoming(Resource):

    def post(self):
        try:
            config.logger.log("INFO", "Filtering upcoming requests")
            email = request.get_json()['email']
            changes = request.get_json()['changes']
            return FetchFilterAppointment().filter_upcoming_appointment_by_doctor_email(email, changes)
        except Exception as e:
            config.logger.log("ERROR", str(e))


class DoctorFetchPast(Resource):

    def post(self):
        try:
            config.logger.log("INFO", "Fetching past appointments")
            email = request.get_json()['email']
            return FetchFilterAppointment().fetch_past_appointment_by_doctor_email(email)
        except Exception as e:
            config.logger.log("ERROR", str(e))


class DoctorFilterPast(Resource):

    def post(self):
        try:
            config.logger.log("INFO", "Filtering past appointments")
            email = request.get_json()['email']
            changes = request.get_json()['changes']
            return FetchFilterAppointment().filter_past_appointment_by_doctor_email(email, changes)
        except Exception as e:
            config.logger.log("ERROR", str(e))


class PatientFetch(Resource):

    def post(self):
        try:
            config.logger.log("INFO", "Fetching appointments for patient")
            email = request.get_json()['email']
            return FetchFilterAppointment().fetch_filter_doctor_info_from_patient_email(email)
        except Exception as e:
            config.logger.log("ERROR", str(e))


class PatientFilter(Resource):

    def post(self):
        try:
            config.logger.log("INFO", "Filtering appointments for patient")
            email = request.get_json()['email']
            changes = request.get_json()['changes']
            return FetchFilterAppointment().fetch_filter_doctor_info_from_patient_email(email, changes)
        except Exception as e:
            config.logger.log("ERROR", str(e))