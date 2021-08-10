from flask import request
from flask_restful import Resource


class ConfirmPayment(Resource):

    def get(self):
        param = request.args
        print(param)