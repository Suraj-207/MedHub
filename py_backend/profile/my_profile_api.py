from flask import request, send_file
from flask_restful import Resource
from py_backend.profile.my_profile import Profile
import config
from PIL import Image
import io
import base64
import requests


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
        print(request.files)
        img = request.files['image']
        im = Image.open(img)
        raw_bytes = io.BytesIO()
        im.save(raw_bytes, "PNG")
        raw_bytes.seek(0)
        img_base64 = base64.b64encode(raw_bytes.read()).decode('utf-8')
        return img_base64



