from jwt import encode, decode, ExpiredSignatureError
import config
from dotenv import load_dotenv
import os
import datetime


class Token:

    def __init__(self):
        try:
            load_dotenv("py_backend/env/secret_key.env")
            self.secret_key = os.getenv("SECRET_KEY")
            self.algorithm = "HS256"
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def generate_token(self, email, user):
        try:
            encoded_token = encode({
                "email": email,
                "user": user,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
            }, self.secret_key, self.algorithm)
            config.logger.log("INFO", "Token generated...")
            return encoded_token
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def validate_token(self, token):
        try:
            decoded_jwt = decode(token, self.secret_key, self.algorithm)
            config.logger.log("INFO", "Decoded token...")
            return {'decoded_token': decoded_jwt, "valid": True}
        except ExpiredSignatureError:
            config.logger.log("CRITICAL", "Token past expiration date...")
            return {'decoded_token': None, "valid": False}
        except Exception as e:
            config.logger.log("ERROR", str(e))
            return {'decoded_token': None, "valid": False}
