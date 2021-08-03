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
                "experience": int(record['experience']),
                "pow": record['place_of_work'],
                "proof": record['proof']
            }
        else:
            self.info_record = {
                "email": record['email'],
                "city": record['city'],
                "state": record['state'],
                "pin": int(record['pin']),
                "phone": int(record['phone'])
            }

    def insert_to_db(self):
        query = "select * from medhub.user where email = '" + self.user_record['email'] + "' allow filtering"
        check_existence = config.cassandra.session.execute(query).one()
        if check_existence is None:
            config.cassandra.insert_one('medhub.user', self.user_record)
            if self.user_record['account'] == 'doctor':
                config.cassandra.insert_one("medhub.doctor", self.info_record)
            else:
                config.cassandra.insert_one("medhub.patient", self.info_record)
            return "Registration successful"
        else:
            return "Email already exists"
