import datetime
import config
from py_backend.geolocation.get_location import Geolocation


class FetchFilter:

    @staticmethod
    def fetch_upcoming_appointment_by_doctor_email(email):
        """

        :param email: email address of doctor
        :return: upcoming appointments in ascending order
        """
        try:
            query = "select * from medhub.appointment where doctor_email = '" + email + "' and status = 'pending' and " \
                                                                                        "start >= '" + \
                    datetime.date.today().isoformat() + "' allow filtering"
            res = []
            for row in config.cassandra.session.execute(query).all():
                fetch_name_query = "select fname,lname from medhub.user where email = '" + row.patient_email + "' allow filtering"
                fetch_name = config.cassandra.session.execute(fetch_name_query).one()
                fetch_gender_query = "select gender from medhub.patient where email = '" + row.patient_email + "' allow filtering"
                fetch_gender = config.cassandra.session.execute(fetch_gender_query).one()
                res.append({
                    "fname": fetch_name.fname,
                    "lname": fetch_name.lname,
                    "gender": fetch_gender.gender,
                    "patient_email": row.patient_email,
                    "start": row.start.isoformat(),
                    "session": row.session,
                    "appt_id": row.appt_id,
                    "diagnosis": row.diagnosis,
                    "prescription": row.prescription,
                    "status": row.status,
                    "issue": row.issue
                })
            res = sorted(res, key=lambda x: x['start'])
            return res
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def filter_upcoming_appointment_by_doctor_email(email, changes):
        """

        :param email: email address of doctor
        :param changes: filters applied
        :return: upcoming appointments in ascending order after filter is applied
        """
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
            query = "select * from medhub.appointment where doctor_email = '" + email + "' and status = 'pending'" + date_condition + patient_condition + appt_condition + " allow filtering"
            res = []
            for row in config.cassandra.session.execute(query).all():
                fetch_name_query = "select fname,lname from medhub.user where email = '" + row.patient_email + "' allow filtering"
                fetch_name = config.cassandra.session.execute(fetch_name_query).one()
                fetch_gender_query = "select gender from medhub.patient where email = '" + row.patient_email + "' allow filtering"
                fetch_gender = config.cassandra.session.execute(fetch_gender_query).one()
                res.append({
                    "fname": fetch_name.fname,
                    "lname": fetch_name.lname,
                    "gender": fetch_gender.gender,
                    "patient_email": row.patient_email,
                    "start": row.start.isoformat(),
                    "session": row.session,
                    "appt_id": row.appt_id,
                    "diagnosis": row.diagnosis,
                    "prescription": row.prescription,
                    "status": row.status,
                    "issue": row.issue
                })
            res = sorted(res, key=lambda x: x['start'])
            return res
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def fetch_past_appointment_by_doctor_email(email):
        """

        :param email: email address of doctor
        :return: past appointments in descending order
        """
        try:
            query = "select * from medhub.appointment where doctor_email = '" + email + "' and status = 'completed' and " \
                                                                                        "start < '" + \
                    datetime.date.today().isoformat() + "' allow filtering "
            res = []
            for row in config.cassandra.session.execute(query).all():
                fetch_name_query = "select fname,lname from medhub.user where email = '" + row.patient_email + "' allow filtering"
                fetch_name = config.cassandra.session.execute(fetch_name_query).one()
                fetch_gender_query = "select gender from medhub.patient where email = '" + row.patient_email + "' allow filtering"
                fetch_gender = config.cassandra.session.execute(fetch_gender_query).one()
                res.append({
                    "fname": fetch_name.fname,
                    "lname": fetch_name.lname,
                    "gender": fetch_gender.gender,
                    "patient_email": row.patient_email,
                    "start": row.start.isoformat(),
                    "session": row.session,
                    "appt_id": row.appt_id,
                    "diagnosis": row.diagnosis,
                    "prescription": row.prescription,
                    "status": row.status,
                    "issue": row.issue
                })
            res = sorted(res, key=lambda x:x['start'], reverse=True)
            return res
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def filter_past_appointment_by_doctor_email(email, changes):
        """

        :param email: email address of doctor
        :param changes: filters applied
        :return: past appointments of doctors in descending order after applying filters
        """
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
            query = "select * from medhub.appointment where doctor_email = '" + email + "' and status = 'completed'" + date_condition + patient_condition + appt_condition + " allow filtering"
            res = []
            for row in config.cassandra.session.execute(query).all():
                fetch_name_query = "select fname,lname from medhub.user where email = '" + row.patient_email + "' allow filtering"
                fetch_name = config.cassandra.session.execute(fetch_name_query).one()
                fetch_gender_query = "select gender from medhub.patient where email = '" + row.patient_email + "' allow filtering"
                fetch_gender = config.cassandra.session.execute(fetch_gender_query).one()
                res.append({
                    "fname": fetch_name.fname,
                    "lname": fetch_name.lname,
                    "gender": fetch_gender.gender,
                    "patient_email": row.patient_email,
                    "start": row.start.isoformat(),
                    "session": row.session,
                    "appt_id": row.appt_id,
                    "diagnosis": row.diagnosis,
                    "prescription": row.prescription,
                    "status": row.status,
                    "issue": row.issue
                })
            res = sorted(res, key=lambda x: x['start'], reverse=True)
            return res
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def fetch_filter_doctor_info_from_patient_email(patient_email, changes=None):
        """

        :param patient_email: email address of patient
        :param changes: filters applied (None by default)
        :return: patient appointments in descending order
        """
        try:
            date_condition = ''
            if changes is not None:
                if changes['appt_id'] is not None:
                    appt_query = "select * from medhub.appointment where appt_id = '" + changes['appt_id'] + "'"
                    appt = config.cassandra.session.execute(appt_query).one()
                    fetch_info_query = "select speciality,experience from medhub.doctor where email = '" + appt.doctor_email + "'"
                    fetch_info = config.cassandra.session.execute(fetch_info_query).one()
                    fetch_name_query = "select fname,lname from medhub.user where email = '" + appt.doctor_email + "'"
                    fetch_name = config.cassandra.session.execute(fetch_name_query).one()
                    return [{
                        "fname": fetch_name.fname,
                        "lname": fetch_name.lname,
                        "speciality": fetch_info.speciality,
                        "experience": fetch_info.experience,
                        "patient_email": appt.patient_email,
                        "start": appt.start.isoformat(),
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
            fetch_appt_info_query = "select * from medhub.appointment where patient_email = '" + patient_email + "'" + date_condition + " allow filtering;"
            fetch_appt_info = config.cassandra.session.execute(fetch_appt_info_query).all()
            res = []
            for appt in fetch_appt_info:
                fetch_info_query = "select speciality,experience from medhub.doctor where email = '" + appt.doctor_email + "' allow filtering"
                fetch_info = config.cassandra.session.execute(fetch_info_query).one()
                fetch_name_query = "select fname,lname from medhub.user where email = '" + appt.doctor_email + "' allow filtering"
                fetch_name = config.cassandra.session.execute(fetch_name_query).one()
                res.append({
                    "fname": fetch_name.fname,
                    "lname": fetch_name.lname,
                    "doctor_email": appt.doctor_email,
                    "speciality": fetch_info.speciality,
                    "experience": fetch_info.experience,
                    "patient_email": appt.patient_email,
                    "start": appt.start.isoformat(),
                    "session": appt.session,
                    "appt_id": appt.appt_id,
                    "diagnosis": appt.diagnosis,
                    "prescription": appt.prescription,
                    "status": appt.status,
                    "issue": appt.issue
                })
            res = sorted(res, key=lambda x: x['start'], reverse=True)
            return res
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def fetch_na_appointments(doctor_email, patient_email, date):
        """

        :param doctor_email: email address of doctor
        :param patient_email: patient email address
        :return: available appointments of the doctor in ascending order
        """
        try:
            next_day = datetime.date.fromisoformat(date) + datetime.timedelta(days=1)
            next_day = next_day.isoformat()
            query = "select * from medhub.appointment where doctor_email = '" + doctor_email + "' and status = 'NA' and " \
                                        "start >= '" + date + "' and start < '" + next_day + "' allow filtering "
            res = []
            history_record = {
                "doctor_email": doctor_email,
                "patient_email": patient_email,
                "date": datetime.datetime.now().isoformat()[:-7]
            }
            config.logger.log("INFO", "Saving patient search history")
            config.cassandra.insert_one("medhub.history", history_record)
            for row in config.cassandra.session.execute(query).all():
                res.append({
                    "start": row.start.isoformat().split('T')[1][:-3],
                    "session": row.session,
                })
            res = sorted(res, key=lambda x: x['start'])
            return res
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def fetch_filter_doctors(patient_email, longitude=None, latitude=None, city=None, state=None, speciality=None):
        """

        :param speciality: filter by speciality
        :param state: filter by state
        :param city: filter by city
        :param latitude: filter by user's geolocation
        :param longitude: filter by user's geolocation
        :param patient_email: email address of patient
        :return: doctors in descending order of experience that are nearest to the place patient lives in
        """
        try:
            fetch_patient_info_query = "select city, state from medhub.patient where email = '" + patient_email + "'"
            fetch_patient_info = config.cassandra.session.execute(fetch_patient_info_query).one()
            speciality_condition = ''
            city_condition = " and city = '" + fetch_patient_info.city + "'"
            state_condition = " and state = '" + fetch_patient_info.state + "'"
            if longitude is not None and latitude is not None:
                geolocation = Geolocation(longitude, latitude)
                city_condition = " and city = '" + geolocation.get_city() + "'"
                state_condition = " and state = '" + geolocation.get_state() + "'"
            if city is not None:
                city_condition = " and city = '" + city + "'"
            if state is not None:
                state_condition = " and state = '" + state + "'"
            if speciality is not None:
                speciality_condition = " and speciality = '" + speciality + "'"
            fetch_doctor_query = "select * from medhub.doctor where active = True and time_set = True" + state_condition + city_condition + speciality_condition + " allow filtering"
            fetch_doctor = FetchFilter().find_doctors(fetch_doctor_query)
            if len(fetch_doctor) == 0:
                fetch_doctor_query = "select * from medhub.doctor where active = True and time_set = True" + state_condition + speciality_condition + " allow filtering"
                fetch_doctor = FetchFilter().find_doctors(fetch_doctor_query)
                if len(fetch_doctor) == 0:
                    fetch_doctor_query = "select * from medhub.doctor where active = True and time_set = True" + speciality_condition + " allow filtering"
                    fetch_doctor = FetchFilter().find_doctors(fetch_doctor_query)
                    if len(fetch_doctor) == 0:
                        status = "No doctors found"
                    else:
                        status = "No doctors found in your state, showing doctors in the country"
                else:
                    status = "No doctors found in your city, showing doctors in your state"
            else:
                status = "Doctors found in your city"
            fetch_doctor = sorted(fetch_doctor, key=lambda x: x['experience'], reverse=True)
            return {"status": status, "doctors": fetch_doctor}
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def find_doctors(fetch_doctor_query):
        fetch_doctor = []
        for row in config.cassandra.session.execute(fetch_doctor_query).all():
            doctor_name_query = "select * from medhub.user where email = '" + row.email + "' allow filtering"
            doctor_name = config.cassandra.session.execute(doctor_name_query).one()
            fetch_doctor.append({
                "email": row.email,
                "fname": doctor_name.fname,
                "lname": doctor_name.lname,
                "speciality": row.speciality,
                "experience": row.experience,
                "place_of_work": row.pow,
                "city": row.city,
                "state": row.state
            })
        return fetch_doctor
