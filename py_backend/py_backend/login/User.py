import config
from werkzeug.security import check_password_hash


class Validation:

    def __init__(self, username, password):
        self.username = username
        self.password = password

    def check(self):
        query = 'select password from medhub.doctor where username = ' + self.username + ' allow filtering'
        result = config.cassandra.session.execute(query).one()
        if result is None:
            return {"status": False, "message": "Email does not exist"}
        else:
            if check_password_hash(result[0], self.password):
                return {"status": True, "message": "Login successful"}
            else:
                return {"status": False, "message": "Wrong password"}

