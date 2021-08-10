import os
import config
from dotenv import load_dotenv
import requests
import json


class Payment:

    def __init__(self):
        load_dotenv("py_backend/env/payment.env")
        self.key = os.getenv("KEY")
        self.secret = os.getenv("SECRET")

    def get_link(self, name, email, phone, amount):
        try:
            phone = str(phone)
            amount = int(amount * 100)
            config.logger.log("INFO", "Generating payment link...")
            response = requests.post(
                url="https://api.razorpay.com/v1/payment_links/",
                json={
                    "amount": amount,
                    "currency": "INR",
                    "accept_partial": False,
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
                        "policy_name": "MedHub"
                    },
                    "callback_url": "https://localhost:5000/api/confirm-payment/",
                    "callback_method": "get"
                },
                auth=requests.auth.HTTPBasicAuth(self.key, self.secret)
            )
            return json.loads(response.content)['short_url']
        except Exception as e:
            config.logger.log("ERROR", str(e))
