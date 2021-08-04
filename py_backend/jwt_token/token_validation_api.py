from flask_restful import Resource
from flask import request
from py_backend.jwt_token.token import Token
import config


class IsValidToken(Resource):

    def post(self):
        try:
            config.logger.log("INFO", "Checking for validity of token...")
            encoded_token = request.get_json()['token']
            token = Token()
            decoded_token = token.validate_token(encoded_token)
            if decoded_token['valid']:
                config.logger.log("INFO", "Token is valid...")
                return {
                    "email": decoded_token['decoded_token']['email'],
                    "password": decoded_token['decoded_token']['password'],
                    "user": decoded_token['decoded_token']['user'],
                    "token": token.generate_token(decoded_token['decoded_token']['email'],
                                                  decoded_token['decoded_token']['password'],
                                                  decoded_token['decoded_token']['user']),
                }
            else:
                config.logger.log("CRITICAL", "Token has expired...")
                return None
        except Exception as e:
            config.logger.log("ERROR", str(e))
