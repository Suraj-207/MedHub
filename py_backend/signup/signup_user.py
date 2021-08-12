import config
from werkzeug.security import generate_password_hash
from py_backend.mail_automation.mail import SendMail
import os
from dotenv import load_dotenv
from py_backend.jwt_token.token import Token


class Registration:

    def __init__(self, record):
        """

        :param record: information on the new user
        """
        try:
            load_dotenv("py_backend/env/email_credentials.env")
            self.sender_email = os.getenv("SENDER_EMAIL")
            self.sender_password = os.getenv("SENDER_PASSWORD")
            self.receiver_email = record['email']
            from_ = "From: MedHub <{}>\n".format(self.sender_email)
            to = "To: {} <{}>\n".format(record['fname'] + " " + record['lname'], self.receiver_email)
            subject = "Subject: Registration in MedHub successful\n\n"
            self.user_record = {
                "email": record['email'].lower(),
                "password": generate_password_hash(record['password']),
                "fname": record['fname'],
                "lname": record['lname'],
                "account": record['account']
            }
            if record['account'] == 'doctor':
                self.info_record = {
                    "email": record['email'].lower(),
                    "speciality": record['speciality'].capitalize(),
                    "experience": int(record['experience']),
                    "pow": record['place_of_work'],
                    "proof": record['proof'],
                    "city": record['city'].capitalize(),
                    "state": record['state'].capitalize(),
                    "active": False,
                    "time_set": False,
                    "break_end": "NA",
                    "break_start": "NA",
                    "end_time": "NA",
                    "start_time": "NA",
                    "session": "NA",
                    "gender": record['gender'],
                    "account": "NA",
                    "ifsc": "NA",
                    "acc_id": "NA",
                    "amount": 0,
                    "image": "NA"
                }
                msg = "Welcome to Medhub, {} {}. We are glad to welcome you to our community.\n".format("Dr.", record['fname'] + " " + record['lname'])
                self.message = from_ + to + subject + msg
            else:
                self.info_record = {
                    "email": record['email'].lower(),
                    "city": record['city'].capitalize(),
                    "state": record['state'].capitalize(),
                    "pin": int(record['pin']),
                    "phone": int(record['phone']),
                    "gender": record['gender']
                }
                msg = "Welcome to Medhub, {}. We are glad to welcome you to our community.\n".format(record['fname'] + " " + record['lname'])
                self.message = from_ + to + subject + msg
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def insert_to_db(self):
        """
        It checks whether the user email is valid or not and also whether it already exists in database or not.
        :return: Returns whether the user is successfully added to database
        """
        try:
            config.logger.log("INFO", "checking if user is already present in database...")
            query = "select * from medhub.user where email = '" + self.user_record['email'] + "' allow filtering"
            check_existence = config.cassandra.session.execute(query).one()
            if check_existence is None:
                email_verify = SendMail(self.sender_email, self.sender_password, self.receiver_email, self.message).send()
                if email_verify:
                    config.logger.log("INFO", "Registering user...")
                    config.cassandra.insert_one('medhub.user', self.user_record)
                    if self.user_record['account'] == 'doctor':
                        config.cassandra.insert_one("medhub.doctor", self.info_record)
                    else:
                        config.cassandra.insert_one("medhub.patient", self.info_record)
                    token = Token().generate_token(self.user_record['email'], self.user_record['account'])
                    return {"user": self.user_record['account'], "message": "Registration Successful", "token": token}
                else:
                    config.logger.log("ERROR", "Email does not exist...")
                    return {"user": False, "message": "Email doesn't exist", "token": None}
            else:
                config.logger.log("WARNING", "Email already exists in database...")
                return {"user": False, "message": "Email already exists", "token": None}
        except Exception as e:
            config.logger.log("ERROR", str(e))
