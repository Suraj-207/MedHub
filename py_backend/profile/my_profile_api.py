from flask import request
from flask_restful import Resource
from py_backend.profile.my_profile import Profile
import config
from py_backend.image_handler.img_to_b64 import ImageConvert


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
        img = request.files['image']
        decoded_img_data = ImageConvert().convert_to_b64(img)
        d = {'decoded': decoded_img_data}
        return d




