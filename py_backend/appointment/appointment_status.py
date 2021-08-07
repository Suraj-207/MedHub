import datetime

import config
from py_backend.appointment.notify import Notification
from py_backend.date_and_time.conversion import Convert
from py_backend.appointment.fetch_and_filter import FetchFilter


class BookCancelReschedule:

    @staticmethod
    def patient_cancel(patient_email, date, doctor_email):
        try:
            difference = Convert().convert_str_to_timestamp(date) - datetime.datetime.now()
            if difference.days >= 3:
                new_val = {
                    "session": "cancelled"
                }
                condition = "doctor_email = '{}' and patient_email = '{}' and start = '{}'".format(doctor_email,
                                                                                                   patient_email, date)
                res = config.cassandra.update("medhub.doctor", new_val, condition)
                if res:
                    Notification().notify_open_slots(doctor_email, date)
                    return True
                else:
                    return False
            else:
                return False
        except Exception as e:
            config.logger.log("ERROR", str(e))
            return False

    @staticmethod
    def doctor_leave(doctor_email, start, end, status):
        query = "select patient_email, start, issue from medhub.appointment where doctor_email = '{}' and start >= '{}' and " \
                "start <= '{}'".format(doctor_email, start, end)
        patients = [{
            "email": row.patient_email,
            "date": row.start,
            "issue": row.issue
        } for row in config.cassandra.session.execute(query).all()]
        if status == 'cancel':
            for patient in patients:
                new_val = {
                    "session": "cancelled"
                }
                condition = "doctor_email = '{}' and patient_email = '{}' and start = '{}'".format(doctor_email,
                                                                                                   patient['email'],
                                                                                                   patient['date'])
                res = config.cassandra.update("medhub.doctor", new_val, condition)
                if res:
                    Notification().notify_cancelled_slots(doctor_email, patient)
                    return True
                else:
                    return False
        else:
            na_appointments = "select start from medhub.appointment where doctor_email = '" + doctor_email + "' and status = 'NA' " \
                                                                                                             "start > '" + datetime.datetime.now().isoformat() + "' allow filtering "
            res = [row.start for row in config.cassandra.session.execute(na_appointments).all()]
            res = sorted(res)
            if len(res) >= len(patients):
                for i in range(len(patients)):
                    new_val = {
                        "session": "rescheduled"
                    }
                    condition = "doctor_email = '{}' and patient_email = '{}' and start = '{}'".format(doctor_email,
                                                                                                       patients[i][
                                                                                                           'email'],
                                                                                                       patients[i][
                                                                                                           'date'])
                    res = config.cassandra.update("medhub.doctor", new_val, condition)
                    new_val_1 = {
                        "session": "pending",
                        "patient_email": patients[i]['email'],
                        "issue": patients[i]['issue']
                    }
                    patients[i]['new_date'] = res[0]
                    condition_1 = "doctor_email = '{}' and start = '{}'".format(doctor_email, patients[i]['email'], patients[i]['date'])
                    res_1 = config.cassandra.update("medhub.doctor", new_val_1, condition_1)
                    if res and res_1:
                        Notification().notify_rescheduled_slots(doctor_email, patients[i])
                        return True
                    else:
                        return False
