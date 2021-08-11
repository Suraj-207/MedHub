from flask import request, send_file
from flask_restful import Resource
from py_backend.profile.my_profile import Profile
import config
from PIL import Image
import io
import base64


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
        print(0)
        im = Image.open(request.files['image'])
        file_object = io.BytesIO()
        im.save(file_object,'PNG')
        # im = Image.open(io.BytesIO(request.get_data()))
        # im.save("hello.jpg")
        converted_string = base64.b64encode(file_object.getvalue())
        
        return send_file(converted_string)
        # print(request.get_json())
        
        # img = request.files['image']
        # im = Image.open(img)
        # im.show()


