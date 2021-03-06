import config
import datetime
from py_backend.mail_automation.mail import SendMail
import os
from dotenv import load_dotenv


class Notification:

    def __init__(self):
        try:
            load_dotenv("py_backend/env/email_credentials.env")
            self.sender_email = os.getenv("SENDER_EMAIL")
            self.sender_password = os.getenv("SENDER_PASSWORD")
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def notify_automate(self, doctor_email, patient_email, message, msg):
        """

        :param doctor_email: email address of doctor
        :param patient_email: email address of patient
        :param message: message to be sent in mail to patient
        :param msg: message to be saved in database
        :return: None
        """
        try:
            notify_record = {
                "patient_email": patient_email,
                "date": datetime.datetime.now().isoformat()[:-7],
                "message": msg,
                "doctor_email": doctor_email
            }
            config.cassandra.insert_one("medhub.notification", notify_record)
            config.logger.log("INFO", "Sending mail...")
            SendMail(self.sender_email, self.sender_password, patient_email, message).send()
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def notify_book_slot(self, doctor_email, patient_email, date):
        """
        Sends a confirmation mail to patient about the booking and also adds the same to database.
        :param doctor_email: email address of doctor
        :param patient_email: email address of patient
        :param date: date of booking slot in string format
        :return: None
        """
        try:
            patient_name_query = "select fname,lname from medhub.user where email = '" + patient_email + "' allow filtering"
            patient_name = config.cassandra.session.execute(patient_name_query).one()
            doctor_name_query = "select fname,lname from medhub.user where email = '" + doctor_email + "' allow filtering"
            doctor_name = config.cassandra.session.execute(doctor_name_query).one()
            from_ = "From: MedHub <{}>\n".format(self.sender_email)
            to = "To: {} <{}>\n".format(patient_name.fname + " " + patient_name.lname, patient_email)
            subject = "Subject: Slot booking confirmation\n\n"
            msg = "Your slot has been booked with Dr. " + doctor_name.fname + " " + doctor_name.lname + " on " + date.replace("T", " ")
            message = from_ + to + subject + msg
            config.logger.log("INFO", "Notifying patients")
            self.notify_automate(doctor_email, patient_email, message, msg)
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def notify_open_slots(self, doctor_email, free_slot):
        """
        Sends a mail to all the patients that has searched about this doctor but couldn't book because
        there was no seat availability and also to patients whose slots are later than this free slot and
        also adds the same to database.
        :param doctor_email: email address of doctor
        :param free_slot: slot that is free
        :return: None
        """
        try:
            time_limit = datetime.date.today() - datetime.timedelta(days=15)
            time_limit_string = time_limit.isoformat()
            fetch_search_history_query = "select patient_email from medhub.history where doctor_email = '" + doctor_email + "' and date > '" + time_limit_string + "' allow filtering"
            fetch_search_history = {i.patient_email for i in config.cassandra.session.execute(fetch_search_history_query).all()}
            doctor_name_query = "select fname,lname from medhub.user where email = '" + doctor_email + "' allow filtering"
            doctor_name = config.cassandra.session.execute(doctor_name_query).one()
            for patient in fetch_search_history:
                patient_name_query = "select fname,lname from medhub.user where email = '" + patient + "' allow filtering"
                patient_name = config.cassandra.session.execute(patient_name_query).one()
                current_appointment_search = "select start from medhub.appointment where patient_email = '" + patient + "' allow filtering"
                current_appointment_execute = config.cassandra.session.execute(current_appointment_search).all()
                from_ = "From: MedHub <{}>\n".format(self.sender_email)
                to = "To: {} <{}>\n".format(patient_name.fname + " " + patient_name.lname, patient)
                subject = "Subject: Free slot available\n\n"
                msg = "free slot available for Dr. " + doctor_name.fname + " " + doctor_name.lname + " on " + free_slot
                message = from_ + to + subject + msg
                if current_appointment_execute is None:
                    self.notify_automate(doctor_email, patient, message, msg)
                else:
                    current_appointment = [i.start for i in current_appointment_execute]
                    if max(current_appointment) > datetime.datetime.strptime(free_slot, "%Y-%m-%dT%H:%M:%S"):
                        self.notify_automate(doctor_email, patient, message, msg)
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def notify_cancelled_slots(self, doctor_email, patient):
        """
        Sends a mail to patient conveying the cancellation in appointment and also adds the same to database
        :param doctor_email: email address of doctor
        :param patient: information on patient whose slots has been cancelled
        :return: None
        """
        try:
            doctor_name_query = "select fname,lname from medhub.user where email = '" + doctor_email + "' allow filtering"
            doctor_name = config.cassandra.session.execute(doctor_name_query).one()
            patient_name_query = "select fname,lname from medhub.user where email = '" + patient['email'] + "' allow filtering"
            patient_name = config.cassandra.session.execute(patient_name_query).one()
            from_ = "From: MedHub <{}>\n".format(self.sender_email)
            to = "To: {} <{}>\n".format(patient_name.fname + " " + patient_name.lname, patient['email'])
            subject = "Subject: Cancellation of appointment\n\n"
            msg = "Your session with Dr. " + doctor_name.fname + " " + doctor_name.lname + " on " + patient['date'].replace('T', ' ')[:-3] + " has been cancelled"
            message = from_ + to + subject + msg
            self.notify_automate(doctor_email, patient['email'], message, msg)
        except Exception as e:
            config.logger.log("ERROR", str(e))
            
    def notify_rescheduled_slots(self, doctor_email, patient):
        """

        Sends a mail to patient conveying the rescheduling in appointment and also adds the same to database
        :param doctor_email: email address of doctor
        :param patient: information on patient whose slots has been cancelled
        :return: None
        """
        try:
            doctor_name_query = "select fname,lname from medhub.user where email = '" + doctor_email + "' allow filtering"
            doctor_name = config.cassandra.session.execute(doctor_name_query).one()
            patient_name_query = "select fname,lname from medhub.user where email = '" + patient['email'] + "' allow filtering"
            patient_name = config.cassandra.session.execute(patient_name_query).one()
            from_ = "From: MedHub <{}>\n".format(self.sender_email)
            to = "To: {} <{}>\n".format(patient_name.fname + " " + patient_name.lname, patient['email'])
            subject = "Subject: Rescheduling of appointment\n\n"
            msg = "Your session with Dr. " + doctor_name.fname + " " + doctor_name.lname + " on " + patient['date'].replace('T', ' ')[:-3] + " has been rescheduled to " + patient['new_date'].replace('T', ' ')[:-3]
            message = from_ + to + subject + msg
            self.notify_automate(doctor_email, patient['email'], message, msg)
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def fetch_notification(patient_email):
        """

        :param patient_email: email address of patient
        :return: notifications in descending order on that patient
        """
        try:
            config.logger.log("INFO", "Fetching notifications...")
            query = "select * from medhub.notification where patient_email = '" + patient_email + "' allow filtering"
            notifications = [{
                "patient_email": row.patient_email,
                "doctor_email": row.doctor_email,
                "date": row.date.isoformat(),
                "message": row.message
            } for row in config.cassandra.session.execute(query).all()]
            notifications = sorted(notifications, key=lambda x: x['date'], reverse=True)
            return notifications
        except Exception as e:
            config.logger.log("ERROR", str(e))
