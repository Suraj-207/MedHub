import config
from werkzeug.security import check_password_hash


class Validation:

    def __init__(self, email, password):
        self.email = email
        self.password = password

    def check(self):
        query = "select password,account from medhub.user where email = '" + self.email + "' allow filtering"
        result = config.cassandra.session.execute(query).one()
        if result is None:
            return {"status": False, "message": "Email does not exist"}
        else:
            if check_password_hash(result[0], self.password):
                return {"status": result[1], "message": "Login successful"}
            else:
                return {"status": False, "message": "Wrong password"}

