import config
from werkzeug.security import check_password_hash
from py_backend.jwt_token.token import Token


class Validation:

    def __init__(self, email, password):
        """

        :param email: email of the user
        :param password: password of the user
        """
        try:
            self.email = email
            self.password = password
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def check(self):
        """

        :return: whether valid or not along with a new jwt.
        """
        try:
            if self.email is not None and self.password is not None:
                self.email = self.email.lower()
                config.logger.log("INFO", "Searching for email in database...")
                query = "select password,account from medhub.user where email = '" + self.email + "' allow filtering"
                result = config.cassandra.session.execute(query).one()
                if result is None:
                    config.logger.log("CRITICAL", "email not found")
                    return {"user": False, "message": "Email does not exist", "token": None}
                else:
                    if check_password_hash(result[0], self.password):
                        token = Token().generate_token(self.email, result[1])
                        config.logger.log("INFO", "Login successful...")
                        return {"user": result[1], "message": "Login successful", "token": token}
                    else:
                        config.logger.log("WARNING", "Wrong password...")
                        return {"user": False, "message": "Wrong password", "token": None}
            else:
                return {"user": False, "message": "Please enter an email and password to log in", "token": None}
        except Exception as e:
            config.logger.log("ERROR", str(e))
