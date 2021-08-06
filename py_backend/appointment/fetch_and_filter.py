import datetime
import config


class FetchFilterAppointment:

    @staticmethod
    def fetch_upcoming_appointment_by_doctor_email(email):
        try:
            query = "select * from medhub.appointment where doctor_email = '" + email + "' and status = 'pending' and " \
                                                                                        "start >= '" + \
                    datetime.date.today().isoformat() + "' order by start asc allow filtering "
            res = []
            for row in config.cassandra.session.execute(query).all():
                fetch_name_query = "select fname,lname from medhub.patient where email = '" + row.patient_email + "'"
                fetch_name = config.cassandra.session.execute(fetch_name_query).one()
                res.append({
                    "fname": fetch_name.fname,
                    "lname": fetch_name.lname,
                    "patient_email": row.patient_email,
                    "start": row.start,
                    "session": row.session,
                    "appt_id": row.appt_id,
                    "diagnosis": row.diagnosis,
                    "prescription": row.prescription,
                    "status": row.status,
                    "issue": row.issue
                })
            return res
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def filter_upcoming_appointment_by_doctor_email(email, changes):
        try:
            patient_condition = ''
            appt_condition = ''
            if changes['date'] is not None:
                next_date = datetime.date.fromisoformat(changes['date']) + datetime.timedelta(days=1)
                next_date = next_date.isoformat()
                date_condition = " and start >= '" + changes['date'] + "' and start < '" + next_date + "'"
            else:
                date_condition = "and start >= '" + datetime.date.today().isoformat() + "'"
            if changes['patient_email'] is not None:
                patient_condition = " and patient_email = '" + changes['patient_email'] + "'"
            if changes['appt_id'] is not None:
                appt_condition = " and appt_id = '" + changes['appt_id'] + "'"
            query = "select * from medhub.appointment where doctor_email = '" + email + "' and status = 'pending'" + date_condition + patient_condition + appt_condition + " order by start asc allow filtering"
            res = []
            for row in config.cassandra.session.execute(query).all():
                fetch_name_query = "select fname,lname from medhub.patient where email = '" + row.patient_email + "'"
                fetch_name = config.cassandra.session.execute(fetch_name_query).one()
                res.append({
                    "fname": fetch_name.fname,
                    "lname": fetch_name.lname,
                    "patient_email": row.patient_email,
                    "start": row.start,
                    "session": row.session,
                    "appt_id": row.appt_id,
                    "diagnosis": row.diagnosis,
                    "prescription": row.prescription,
                    "status": row.status,
                    "issue": row.issue
                })
            return res
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def fetch_past_appointment_by_doctor_email(email):
        try:
            query = "select * from medhub.appointment where doctor_email = '" + email + "' and status = 'completed' and " \
                                                                                        "start < '" + \
                    datetime.date.today().isoformat() + "' order by start desc allow filtering "
            res = []
            for row in config.cassandra.session.execute(query).all():
                fetch_name_query = "select fname,lname from medhub.patient where email = '" + row.patient_email + "'"
                fetch_name = config.cassandra.session.execute(fetch_name_query).one()
                res.append({
                    "fname": fetch_name.fname,
                    "lname": fetch_name.lname,
                    "patient_email": row.patient_email,
                    "start": row.start,
                    "session": row.session,
                    "appt_id": row.appt_id,
                    "diagnosis": row.diagnosis,
                    "prescription": row.prescription,
                    "status": row.status,
                    "issue": row.issue
                })
            return res
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def filter_past_appointment_by_doctor_email(email, changes):
        try:
            patient_condition = ''
            appt_condition = ''
            if changes['date'] is not None:
                next_date = datetime.date.fromisoformat(changes['date']) + datetime.timedelta(days=1)
                next_date = next_date.isoformat()
                date_condition = " and start >= '" + changes['date'] + "' and start < '" + next_date + "'"
            else:
                date_condition = "and start < '" + datetime.date.today().isoformat() + "'"
            if changes['patient_email'] is not None:
                patient_condition = " and patient_email = '" + changes['patient_email'] + "'"
            if changes['appt_id'] is not None:
                appt_condition = " and appt_id = '" + changes['appt_id'] + "'"
            query = "select * from medhub.appointment where doctor_email = '" + email + "' and status = 'completed'" + date_condition + patient_condition + appt_condition + " order by start desc allow filtering"
            res = []
            for row in config.cassandra.session.execute(query).all():
                fetch_name_query = "select fname,lname from medhub.patient where email = '" + row.patient_email + "'"
                fetch_name = config.cassandra.session.execute(fetch_name_query).one()
                res.append({
                    "fname": fetch_name.fname,
                    "lname": fetch_name.lname,
                    "patient_email": row.patient_email,
                    "start": row.start,
                    "session": row.session,
                    "appt_id": row.appt_id,
                    "diagnosis": row.diagnosis,
                    "prescription": row.prescription,
                    "status": row.status,
                    "issue": row.issue
                })
            return res
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def fetch_filter_doctor_info_from_patient_email(patient_email, changes=None):
        try:
            date_condition = ''
            if changes is not None:
                if changes['appt_id'] is not None:
                    appt_query = "select * from medhub.appointment where appt_id = '" + changes['appt_id'] + "'"
                    appt = config.cassandra.session.execute(appt_query).one()
                    fetch_name_query = "select fname,lname,speciality,experience from medhub.doctor where email = '" + appt.doctor_email + "'"
                    fetch_name = config.cassandra.session.execute(fetch_name_query).one()
                    return [{
                        "fname": fetch_name.fname,
                        "lname": fetch_name.lname,
                        "speciality": fetch_name.speciality,
                        "experience": fetch_name.experience,
                        "patient_email": appt.patient_email,
                        "start": appt.start,
                        "session": appt.session,
                        "appt_id": appt.appt_id,
                        "diagnosis": appt.diagnosis,
                        "prescription": appt.prescription,
                        "status": appt.status,
                        "issue": appt.issue
                    }]
                else:
                    next_date = datetime.date.fromisoformat(changes['date']) + datetime.timedelta(days=1)
                    next_date = next_date.isoformat()
                    date_condition = " and start >= '" + changes['date'] + "' and start < '" + next_date + "'"
            query = "select doctor_email from medhub.appointment where patient_email = '" + patient_email + "' allow filtering;"
            rows = config.cassandra.session.execute(query).all()
            res = []
            for row in list(set(rows)):
                fetch_name_query = "select fname,lname,speciality,experience from medhub.doctor where email = '" + row.doctor_email + "'"
                fetch_name = config.cassandra.session.execute(fetch_name_query).one()
                appointments = []
                fetch_appt_info_query = "select * from medhub.appointment where doctor_email = " + row.doctor_email + "' patient_email = '" + patient_email + "'" + date_condition + " order by start desc allow filtering;"
                fetch_appt_info = config.cassandra.session.execute(fetch_appt_info_query).all()
                for appt in fetch_appt_info:
                    appointments.append({
                        "fname": fetch_name.fname,
                        "lname": fetch_name.lname,
                        "speciality": fetch_name.speciality,
                        "experience": fetch_name.experience,
                        "patient_email": appt.patient_email,
                        "start": appt.start,
                        "session": appt.session,
                        "appt_id": appt.appt_id,
                        "diagnosis": appt.diagnosis,
                        "prescription": appt.prescription,
                        "status": appt.status,
                        "issue": appt.issue
                    })
                res = res.extend(appointments)
            res = sorted(res, key=lambda x: x['start'], reverse=True)
            return res
        except Exception as e:
            config.logger.log("ERROR", str(e))


