from flask import request
from flask_restful import Resource
from py_backend.profile.my_profile import Profile
import config
from py_backend.image_handler.img_to_b64 import ImageConvert
from py_backend.jwt_token.token import Token


class FetchProfile(Resource):

    def post(self):
        try:
            token = request.get_json()['token']
            print(token)
            config.logger.log("INFO", "Sending token to fetch profile...")
            return Profile(token).show_profile()
        except Exception as e:
            config.logger.log("ERROR", str(e))


class ChangeProfile(Resource):

    def post(self):
        try:
            token = request.get_json()['token']
            changes = request.get_json()['changes']
            config.logger.log("INFO", "Sending token and changes to update profile...")
            return Profile(token).change_profile(changes)
        except Exception as e:
            config.logger.log("ERROR", str(e))


class FetchImage(Resource):

    def post(self):
        try:
            img = request.files['image']
            token = request.form['token']
            return Profile(token).change_profile_image(img)
        except Exception as e:
            config.logger.log("ERROR", str(e))
            return False




