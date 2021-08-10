import os
import config
from py_backend.logger.log_db import Logger
from flask import Flask, send_from_directory
from flask_restful import Api
from flask_cors import CORS
from py_backend.cassandra_db.crud import Operations
from py_backend.login.login_api import Login
from py_backend.signup.signup_api import Signup
from py_backend.jwt_token.token_validation_api import IsValidToken
from py_backend.profile.my_profile_api import FetchProfile, ChangeProfile, FetchImage
from apscheduler.schedulers.background import BackgroundScheduler
from py_backend.appointment.slots import SlotMaker
from py_backend.appointment.fetch_and_filter_api import DoctorFetchPast, DoctorFetchUpcoming, DoctorFilterPast, DoctorFilterUpcoming, PatientFetch, PatientFilter, FetchNAAppointments, FetchDoctors, FilterDoctors
from py_backend.appointment.notify_patient_api import NotifyPatient
from py_backend.appointment.appointment_status_api import BookSlot, CancelSlot, TakeALeave, DoctorComplete, ConfirmPayment
import multiexit
import datetime


app = Flask(__name__, static_url_path='', static_folder='/frontend/build')
CORS(app)
config.logger = Logger()
config.cassandra = Operations(config.logger)
api = Api(app)
scheduler = BackgroundScheduler()
scheduler.add_job(
    func=SlotMaker().assign_slots_scheduling,
    trigger="interval",
    seconds=86400,
    next_run_time=datetime.datetime.combine(datetime.date.today() + datetime.timedelta(days=0),
                                            datetime.time(hour=16, minute=30)))
scheduler.start()
multiexit.install()
multiexit.register(config.cassandra.shutdown, shared=True)
multiexit.register(scheduler.shutdown, shared=True)


@app.route('/', defaults={'path': ''})
def home_page(path):
    return send_from_directory(app.static_folder, 'index.html')


api.add_resource(Login, '/api/login')
api.add_resource(Signup, '/api/signup')
api.add_resource(IsValidToken, '/api/check-token')
api.add_resource(FetchProfile, '/api/fetch-profile')
api.add_resource(ChangeProfile, '/api/change-profile')
api.add_resource(DoctorFetchUpcoming, '/api/doctor-fetch-upcoming')
api.add_resource(DoctorFilterUpcoming, '/api/doctor-filter-upcoming')
api.add_resource(DoctorFetchPast, '/api/doctor-fetch-past')
api.add_resource(DoctorFilterPast, '/api/doctor-filter-past')
api.add_resource(PatientFetch, '/api/patient-fetch')
api.add_resource(PatientFilter, '/api/patient-filter')
api.add_resource(FetchNAAppointments, '/api/fetch-na-appointments')
api.add_resource(FetchDoctors, '/api/fetch-doctors')
api.add_resource(FilterDoctors, '/api/filter-doctors')
api.add_resource(NotifyPatient, '/api/notifications')
api.add_resource(BookSlot, '/api/book-slot')
api.add_resource(CancelSlot, '/api/cancel-slot')
api.add_resource(TakeALeave, '/api/take-a-leave')
api.add_resource(DoctorComplete, '/api/doctor-complete')
api.add_resource(ConfirmPayment, '/api/confirm-payment/')
api.add_resource(FetchImage, '/api/fetch-image')


if __name__ == '__main__':
    config.logger.log("INFO", "App starting...")
    port = int(os.environ.get('PORT', 5000))
    app.run(host='127.0.0.1', port=port, debug=True,ssl_context=('frontend/certificate.crt','frontend/certificate.key'))
