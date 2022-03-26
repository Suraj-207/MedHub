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
        """

        :param name: name of patient
        :param email: email of patient
        :param phone: phone no of patient
        :param amount: amount charged by doctor
        :param doctor_email: email of doctor
        :param date: date of appointment
        :return: link for payment
        """
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
                        "patient_email": email,
                        "doctor_email": doctor_email,
                        "date": date
                    },
                    "callback_url": "https://medhub.rechnegen.com/api/confirm-payment/",
                    "callback_method": "get"
                },
                auth=requests.auth.HTTPBasicAuth(self.key, self.secret)
            )
            return json.loads(response.content)['short_url']
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def get_notes_from_pay_id(self, pay_id):
        """

        :param pay_id: payment id generated after payment
        :return: notes regarding appointment
        """
        try:
            client = razorpay.Client(auth=(self.key, self.secret))
            info = client.payment.fetch(pay_id)
            notes = info['notes']
            print(notes)
            return notes
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def transfer(self, acc_id, pay_id):
        """
        transfers funds to doctors account
        :param acc_id: doctor's account id
        :param pay_id: payment id generated after booking
        :return: None
        """
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
                      "amount": info['amount'] - 5000,
                      "currency": "INR",
                      "notes": {
                        "name": fetch_name.fname + ' ' + fetch_name.lname
                      },
                      "on_hold": False
                      # "on_hold_until":
                    }]},
                auth=requests.auth.HTTPBasicAuth(self.key, self.secret)
            )
            print(response)
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def refund(self, pay_id):
        """
        refunds back the patient on cancellation.
        :param pay_id: payment id generated
        :return: None
        """
        try:
            client = razorpay.Client(auth=(self.key, self.secret))
            info = client.payment.fetch(pay_id)
            response = requests.post(
                url="https://api.razorpay.com/v1/payments/{}/refund/".format(pay_id),
                json={
                  "amount": info['amount'] - 5000,
                  "reverse_all": 1
                },
                auth=requests.auth.HTTPBasicAuth(self.key, self.secret)
            )
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def refund_convenience_fee(self, pay_id):
        """
        refunds back the patient on cancellation.
        :param pay_id: payment id generated
        :return: None
        """
        try:
            client = razorpay.Client(auth=(self.key, self.secret))
            response = requests.post(
                url="https://api.razorpay.com/v1/payments/{}/refund/".format(pay_id),
                json={
                  "amount": 5000,
                  "reverse_all": 0
                },
                auth=requests.auth.HTTPBasicAuth(self.key, self.secret)
            )
        except Exception as e:
            config.logger.log("ERROR", str(e))