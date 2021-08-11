import config


class Admin:

    @staticmethod
    def show_all_inactive_doctor_status():
        try:
            doctors_query = 'select * from medhub.doctor where active = False allow filtering'
            doctors = []
            for row in config.cassandra.session.execute(doctors_query).all():
                name_query = "select fname,lname from medhub.user where email = " + row.email + "' allow filtering"
                name = config.cassandra.session.execute(name_query).one()
                doctors.append({
                    "fname": name.fname,
                    "lname": name.lname,
                    "email": row.email,
                    "proof": row.proof,
                    "active": row.active,
                    "acc_no": row.acc_no,
                    "ifsc": row.ifsc,
                    "acc_id": row.acc_id
                })
            return doctors
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def give_permission(email, acc_id, active):
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
