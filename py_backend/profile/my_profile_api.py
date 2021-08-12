from flask import request, send_file, redirect, url_for
from flask_restful import Resource
from py_backend.profile.my_profile import Profile
import config
from PIL import Image
import io
import base64
import json


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
        ext = request.files['image'].mimetype.split("/")[1].upper()
        im = Image.open(img)
        data = io.BytesIO()
        im.save(data, ext, quality=20, optimize=True)
        decoded_img_data = base64.b64encode(data.getvalue()).decode('utf-8')
        d = {'decoded': decoded_img_data}
        return d




