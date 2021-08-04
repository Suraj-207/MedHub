import config
from werkzeug.security import check_password_hash


class Validation:

    def __init__(self, email, password):
        try:
            self.email = email
            self.password = password
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def check(self):
        try:
            config.logger.log("INFO", "Searching for email in database...")
            query = "select password,account from medhub.user where email = '" + self.email + "' allow filtering"
            result = config.cassandra.session.execute(query).one()
            if result is None:
                config.logger.log("CRITICAL", "email not found")
                return {"status": False, "message": "Email does not exist"}
            else:
                if check_password_hash(result[0], self.password):
                    config.logger.log("INFO", "Login successful...")
                    return {"status": result[1], "message": "Login successful"}
                else:
                    config.logger.log("WARNING", "Wrong password...")
                    return {"status": False, "message": "Wrong password"}
        except Exception as e:
            config.logger.log("ERROR", str(e))
