import config
from werkzeug.security import generate_password_hash


class Registration:

    def __init__(self, record):
        self.user_record = {
            "email": record['email'],
            "password": generate_password_hash(record['password']),
            "fname": record['fname'],
            "lname": record['lname'],
            "account": record['account']
        }
        if record['account'] == 'doctor':
            self.info_record = {
                "email": record['email'],
                "speciality": record['speciality'],
                "experience": record['experience'],
                "pow": record['place_of_work'],
                "proof": record['proof']
            }
        else:
            self.info_record = {
                "email": record['email'],
                "city": record['city'],
                "state": record['state'],
                "pin": record['pin'],
                "phone": record['phone']
            }

    def insert_to_db(self):
        config.cassandra.insert_one('medhub.user', self.user_record)
        if self.user_record['account'] == 'doctor':
            config.cassandra.insert_one("medhub.doctor", self.info_record)
        else:
            config.cassandra.insert_one("medhub.patient", self.info_record)
        return "Registration successful"
