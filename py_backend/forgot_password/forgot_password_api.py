from flask_restful import Resource
from flask import request
import config
from py_backend.mail_automation.mail import SendMail
import random
from dotenv import load_dotenv
import os
from werkzeug.security import generate_password_hash


class OTP(Resource):

    def post(self):
        try:
            email = request.get_json()['email']
            check_email_query = "select * from medhub.user where email = '" + email + "' allow filtering"
            check_email = config.cassandra.session.execute(check_email_query).one()
            if check_email is not None:
                name_query = "select fname,lname from medhub.user where email = '" + email + "' allow filtering"
                name = config.cassandra.session.execute(name_query).one()
                load_dotenv("py_backend/env/email_credentials.env")
                sender_email = os.getenv("SENDER_EMAIL")
                sender_password = os.getenv("SENDER_PASSWORD")
                otp = random.randint(100000, 999999)
                from_ = "From: MedHub <{}>\n".format(sender_email)
                to = "To: {} <{}>\n".format(name.fname + " " + name.lname, email)
                subject = "Subject: Slot booking confirmation\n\n"
                msg = "OTP for setting new password : " + str(otp) + ". Please do not share it with anybody."
                message = from_ + to + subject + msg
                SendMail(sender_email, sender_password, email, message)
                return {'otp': otp, 'valid': True}
            else:
                return {'otp': None, 'valid': False}
        except Exception as e:
            config.logger.log("ERROR", str(e))
            return {'otp': None, 'valid': False}


class SetPassword(Resource):

    def post(self):
        try:
            email = request.get_json()['email']
            password = request.get_json()['password']
            new_val = {
                "password": generate_password_hash(password)
            }
            condition = "email = '" + email + "'"
            res = config.cassandra.update("medhub.user", new_val, condition)
            if res:
                return "Password successfully set"
            else:
                return "User not found"
        except Exception as e:
            config.logger.log("ERROR", str(e))
            return "Some error occured"
