import config
from py_backend.jwt_token.token import Token
from py_backend.appointment.slots import SlotMaker
import threading
from py_backend.image_handler.img_to_b64 import ImageConvert


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
                        "gender": row.gender,
                        "amount": row.amount,
                        "acc_no": row.account,
                        "ifsc": row.ifsc,
                        "city": row.city,
                        "state": row.state,
                        "image": row.image
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
                    if "amount" in changes.keys():
                        changes['amount'] = int(changes['amount'])
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
                    check_payment_changes_query = "select acc_no, ifsc, acc_id from medhub.doctor where email = '" + email + "' allow filtering"
                    check_payment_changes = config.cassandra.session.execute(check_payment_changes_query).one()
                    if check_payment_changes.acc_id != 'NA' and changes['account'] != check_payment_changes.account:
                        changes['active'] = False
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

    def change_profile_image(self, img):
        try:
            if self.token['valid']:
                email = self.token['decoded_token']['email']
                decoded_img_data = ImageConvert().convert_to_b64(img)
                new_val = {
                    "image": decoded_img_data
                }
                condition = "email = '" + email + "'"
                return config.cassandra.update("medhub.doctor", new_val, condition)
        except Exception as e:
            config.logger.log("ERROR", str(e))
            return False





