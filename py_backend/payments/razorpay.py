import os
import config
from dotenv import load_dotenv
import requests
import json
import datetime
import razorpay


class Payment:

    def __init__(self):
        load_dotenv("py_backend/env/payment.env")
        self.key = os.getenv("KEY")
        self.secret = os.getenv("SECRET")

    def get_link(self, name, email, phone, amount, doctor_email, date):
        try:
            phone = str(phone)
            amount = int(amount * 100)
            exp = int(datetime.datetime.timestamp(datetime.datetime.now() + datetime.timedelta(hours=1)))
            config.logger.log("INFO", "Generating payment link...")
            response = requests.post(
                url="https://api.razorpay.com/v1/payment_links/",
                json={
                    "amount": amount,
                    "currency": "INR",
                    "accept_partial": False,
                    "expire_by": exp,
                    "description": "Payment for appointment",
                    "customer": {
                        "name": name,
                        "contact": phone,
                        "email": email
                    },
                    "notify": {
                        "sms": True,
                        "email": True
                    },
                    "reminder_enable": True,
                    "notes": {
                        "doctor_email": doctor_email,
                        "date": date
                    },
                    "callback_url": "https://localhost:5000/api/confirm-payment/",
                    "callback_method": "get"
                },
                auth=requests.auth.HTTPBasicAuth(self.key, self.secret)
            )
            return json.loads(response.content)['short_url']
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def get_notes_from_pay_id(self, pay_id):
        try:
            client = razorpay.Client(auth=(self.key, self.secret))
            info = client.payment.fetch(pay_id)
            notes = info['notes']
            notes.update({"patient_email": info['email']})
            return notes
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def transfer(self, acc_id, pay_id):
        try:
            client = razorpay.Client(auth=(self.key, self.secret))
            info = client.payment.fetch(pay_id)
            doctor_email = info['notes']['doctor_email']
            fetch_name_query = "select fname, lname from medhub.user where email = '" + doctor_email + "' allow filtering"
            fetch_name = config.cassandra.session.execute(fetch_name_query).one()
            hold = int(datetime.datetime.timestamp(datetime.datetime.fromisoformat(info['notes']['date'])))
            response = requests.post(
                url="https://api.razorpay.com/v1/payments/{}/transfers/".format(pay_id),
                json={
                  "transfers": [
                    {
                      "account": acc_id,
                      "amount": info['amount'] - 100,
                      "currency": "INR",
                      "notes": {
                        "name": fetch_name.fname + ' ' + fetch_name.lname
                      },
                      "on_hold": True,
                      "on_hold_until": hold
                    }]},
                auth=requests.auth.HTTPBasicAuth(self.key, self.secret)
            )
            print(response)
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def refund(self, pay_id):
        try:
            client = razorpay.Client(auth=(self.key, self.secret))
            info = client.payment.fetch(pay_id)
            response = requests.post(
                url="https://api.razorpay.com/v1/payments/{}/refund/".format(pay_id),
                json={
                  "amount": info['amount'] - 100,
                  "reverse_all": 1
                },
                auth=requests.auth.HTTPBasicAuth(self.key, self.secret)
            )
        except Exception as e:
            config.logger.log("ERROR", str(e))

