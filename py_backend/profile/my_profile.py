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
                user_query = "select * from medhub.user where email = '" + email + "' allow filtering"
                print(user_query)
                user_row = config.cassandra.session.execute(user_query).one()
                print("query completed")
                user_dict = {
                    "email": user_row.email,
                    "fname": user_row.fname,
                    "lname": user_row.lname,
                    "user": user_row.account
                }
                if user == 'doctor':
                    config.logger.log("INFO", "Fetching the doctors profile from database...")
                    query = "select * from medhub.doctor where email = '" + email + "' allow filtering"
                    row = config.cassandra.session.execute(query).one()
                    doctor_dict = {
                        "active": row.active,
                        "experience": row.experience,
                        "pow": row.pow,
                        "proof": row.proof,
                        "session": row.session,
                        "speciality": row.speciality,
                        "break_end": row.break_end,
                        "break_start": row.break_start,
                        "end_time": row.end_time,
                        "start_time": row.start_time
                    }
                    user_dict.update(doctor_dict)
                    return user_dict
                elif user == 'patient':
                    config.logger.log("INFO", "Fetching the patients profile from database...")
                    query = "select * from medhub.patient where email = '" + email + "' allow filtering"
                    row = config.cassandra.session.execute(query).one()
                    patient_dict = {
                        "city": row.city,
                        "phone": row.phone,
                        "pin": row.pin,
                        "state": row.state
                    }
                    user_dict.update(patient_dict)
                    return user_dict
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def change_profile(self, changes):
        try:
            if self.token['valid']:
                email = self.token['decoded_token']['email']
                user = self.token['decoded_token']['user']
                condition = "email = '" + email + "'"
                if user == "doctor":
                    if 'experience' in changes.keys():
                        changes['experience'] = int(changes['experience'])
                    config.logger.log("INFO", "Updating doctors profile")
                    config.cassandra.update("medhub.doctor", changes, condition)
                    return "changed"
                elif user == "patient":
                    if 'pin' in changes.keys():
                        changes['pin'] = int(changes['pin'])
                    if 'phone' in changes.keys():
                        changes['phone'] = int(changes['phone'])
                    config.logger.log("INFO", "Updating patients profile")
                    config.cassandra.update("medhub.patient", changes, condition)
                    return "changed"
        except Exception as e:
            config.logger.log("ERROR", str(e))
