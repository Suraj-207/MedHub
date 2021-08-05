import config
from py_backend.jwt_token.token import Token


class Profile:

    def __init__(self, token):
        self.token = Token().validate_token(token)

    def show_profile(self):
        try:
            if self.token['valid']:
                email = self.token['decoded_token']['email']
                user = self.token['decoded_token']['user']
                if user == 'doctor':
                    config.logger.log("INFO", "Fetching the doctor's profile from database...")
                    query = "select * from medhub.doctor where email = '" + email + "'"
                    result = config.cassandra.session.execute(query).one()
                    return result
                elif user == 'patient':
                    config.logger.log("INFO", "Fetching the patient's profile from database...")
                    query = "select * from medhub.patient where email = '" + email + "'"
                    result = config.cassandra.session.execute(query).one()
                    return result
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def change_profile(self, changes):
        if self.token['valid']:
            try:
                email = self.token['decoded_token']['email']
                user = self.token['decoded_token']['user']
                condition = "email = '" + email + "'"
                if user == "doctor":
                    if 'experience' in changes.keys():
                        changes['experience'] = int(changes['experience'])
                    config.logger.log("INFO", "Updating doctor's profile")
                    config.cassandra.update("medhub.doctor", changes, condition)
                    return "changed"
                elif user == "patient":
                    if 'pin' in changes.keys():
                        changes['pin'] = int(changes['pin'])
                    if 'phone' in changes.keys():
                        changes['phone'] = int(changes['phone'])
                    config.logger.log("INFO", "Updating patient's profile")
                    config.cassandra.update("medhub.patient", changes, condition)
                    return "changed"
            except Exception as e:
                config.logger.log("ERROR", str(e))
