import datetime
import config


class FetchFilterAppointment:

    @staticmethod
    def fetch_upcoming_appointment_by_doctor_email(email):
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

    @staticmethod
    def filter_upcoming_appointment_by_doctor_email(email, changes):
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

    @staticmethod
    def fetch_past_appointment_by_doctor_email(email):
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

    @staticmethod
    def filter_past_appointment_by_doctor_email(email, changes):
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
