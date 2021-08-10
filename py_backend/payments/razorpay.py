import os
import config
from dotenv import load_dotenv
import requests
import json


class Payment:

    def __init__(self, name, email, phone, amount):
        load_dotenv("py_backend/env/payment.env")
        self.key = os.getenv("KEY")
        self.secret = os.getenv("SECRET")
        self.name = name
        self.email = email
        self.phone = str(phone)
        self.amount = int(amount * 100)

    def get_link(self):
        try:
            config.logger.log("INFO", "Generating payment link...")
            response = requests.post(
                url="https://api.razorpay.com/v1/payment_links/",
                json={
                    "amount": self.amount,
                    "currency": "INR",
                    "accept_partial": False,
                    "description": "Payment for appointment",
                    "customer": {
                        "name": self.name,
                        "contact": self.phone,
                        "email": self.email
                    },
                    "notify": {
                        "sms": True,
                        "email": True
                    },
                    "reminder_enable": True,
                    "notes": {
                        "policy_name": "MedHub"
                    },
                    "callback_url": "https://localhost:5000/api/confirmpayment/",
                    "callback_method": "get"
                },
                auth=requests.auth.HTTPBasicAuth(self.key, self.secret)
            )
            return json.loads(response.content)['short_url']
        except Exception as e:
            config.logger.log("ERROR", str(e))
