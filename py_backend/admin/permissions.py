import config


class Admin:

    @staticmethod
    def show_all_inactive_doctor_status():
        """

        :return: Doctors whose account are yet to be activated.
        """
        try:
            doctors_query = 'select * from medhub.doctor where active = False allow filtering'
            doctors = []
            for row in config.cassandra.session.execute(doctors_query).all():
                name_query = "select fname,lname from medhub.user where email = '" + row.email + "' allow filtering"
                name = config.cassandra.session.execute(name_query).one()
                doctors.append({
                    "fname": name.fname,
                    "lname": name.lname,
                    "email": row.email,
                    "proof": row.proof,
                    "active": row.active,
                    "account": row.account,
                    "ifsc": row.ifsc,
                    "acc_id": row.acc_id
                })
            return doctors
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def give_permission(email, acc_id, active):
        """

        :param email: email of doctor
        :param acc_id: new account id assigned by admin to doctor after reviewing.
        :param active: True is returned in case doctor passes all checks.
        :return: True if changes are successful else False
        """
        try:
            new_val = {
                "acc_id": acc_id,
                "active": bool(active)
            }
            condition = "email = '" + email + "'"
            res = config.cassandra.update("medhub.doctor", new_val, condition)
            if res:
                return True
            else:
                return False
        except Exception as e:
            config.logger.log("ERROR", str(e))
            return False

    @staticmethod
    def show_all_active_doctor_status():
        """

        :return: Doctors whose account are activated.
        """
        try:
            doctors_query = 'select * from medhub.doctor where active = True allow filtering'
            doctors = []
            for row in config.cassandra.session.execute(doctors_query).all():
                name_query = "select fname,lname from medhub.user where email = '" + row.email + "' allow filtering"
                name = config.cassandra.session.execute(name_query).one()
                doctors.append({
                    "fname": name.fname,
                    "lname": name.lname,
                    "email": row.email,
                    "proof": row.proof,
                    "active": row.active,
                    "account": row.account,
                    "ifsc": row.ifsc,
                    "acc_id": row.acc_id
                })
            return doctors
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def halt_permission(email, active):
        """

        :param email: email of doctor
        :param active: True is returned if doctors profile is ceased.
        :return: True if changes are successful else False
        """
        try:
            new_val = {
                "active": bool(active)
            }
            condition = "email = '" + email + "'"
            res = config.cassandra.update("medhub.doctor", new_val, condition)
            if res:
                return True
            else:
                return False
        except Exception as e:
            config.logger.log("ERROR", str(e))
            return False

