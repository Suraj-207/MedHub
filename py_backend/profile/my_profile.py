import config
from py_backend.jwt_token.token import Token
from py_backend.appointment.slots import SlotMaker
import threading


class Profile:

    def __init__(self, token):
        """

        :param token: jwt
        """
        self.token = Token().validate_token(token)

    def show_profile(self):
        """

        :return: returns the profile details of the user
        """
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
                        "start_time": row.start_time,
                        "gender": row.gender
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
                        "state": row.state,
                        "gender": row.gender
                    }
                    user_dict.update(patient_dict)
                    return user_dict
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def change_profile(self, changes):
        """

        :param changes: changes to the account
        :return: "changed" if successfully changed else None
        """
        try:
            if self.token['valid']:
                email = self.token['decoded_token']['email']
                user = self.token['decoded_token']['user']
                condition = "email = '" + email + "'"
                if user == "doctor":
                    if 'city' in changes.keys():
                        changes['city'] = changes['city'].capitalize()
                    if 'state' in changes.keys():
                        changes['state'] = changes['state'].capitalize()
                    if 'speciality' in changes.keys():
                        changes['speciality'] = changes['speciality'].capitalize()
                    if 'experience' in changes.keys():
                        changes['experience'] = int(changes['experience'])
                    if changes['session'] != 'NA' and changes['start_time'] != "NA" and changes['end_time'] != "NA":
                        check_first_query = "select time_set from medhub.doctor where email = '" + email + "' allow filtering"
                        res = config.cassandra.session.execute(check_first_query).one()[0]
                        changes['time_set'] = True
                    config.logger.log("INFO", "Updating doctors profile")
                    response = config.cassandra.update("medhub.doctor", changes, condition)
                    if response:
                        if not res:
                            config.logger.log("INFO", "Making slots for first time")
                            slot_thread = threading.Thread(target=SlotMaker().make_slots_first_time,
                                                           args=(email, changes['start_time'], changes['end_time'],
                                                              changes['break_start'], changes['break_end'],
                                                              changes['session']))
                            slot_thread.start()
                        return "changed"
                elif user == "patient":
                    if 'pin' in changes.keys():
                        changes['pin'] = int(changes['pin'])
                    if 'phone' in changes.keys():
                        changes['phone'] = int(changes['phone'])
                    if 'city' in changes.keys():
                        changes['city'] = changes['city'].capitalize()
                    if 'state' in changes.keys():
                        changes['state'] = changes['state'].capitalize()
                    config.logger.log("INFO", "Updating patients profile")
                    response = config.cassandra.update("medhub.patient", changes, condition)
                    if response:
                        return "changed"
        except Exception as e:
            config.logger.log("ERROR", str(e))
