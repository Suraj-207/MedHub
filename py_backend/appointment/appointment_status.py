import datetime
import threading
import config
from py_backend.appointment.notify import Notification
from py_backend.date_and_time.conversion import Convert


class BookCancelReschedule:

    @staticmethod
    def patient_book(patient_email, date, doctor_email, issue):
        try:
            new_val = {
                "session": "pending",
                "issue": issue
            }
            condition = "doctor_email = '{}' and patient_email = '{}' and start = '{}'".format(doctor_email,
                                                                                               patient_email, date)
            res = config.cassandra.update("medhub.doctor", new_val, condition)
            if res:
                # Notification().notify_book_slot(doctor_email, patient_email, date)
                threading.Thread(target=Notification().notify_book_slot, args=(doctor_email, patient_email, date)).start()
                return True
            else:
                return False
        except Exception as e:
            config.logger.log("ERROR", str(e))
            return False


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
                    # Notification().notify_open_slots(doctor_email, date)
                    threading.Thread(target=Notification().notify_open_slots, args=(doctor_email, date)).start()
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
        try:
            query = "select patient_email, start, issue from medhub.appointment where doctor_email = '{}' and start >= '{}' and " \
                    "start <= '{}'".format(doctor_email, start, end)
            patients = [{
                "email": row.patient_email,
                "date": row.start.isoformat()[:-7],
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
                        # Notification().notify_cancelled_slots(doctor_email, patient)
                        threading.Thread(target=Notification().notify_cancelled_slots, args=(doctor_email, patient)).start()
                        return True
                    else:
                        return False
            else:
                res, res_1, res_2 = False, False, False
                na_appointments = "select start from medhub.appointment where doctor_email = '" + doctor_email + "' and status = 'NA' " \
                                                                                                                 "start > '" + datetime.datetime.now().isoformat()[:-7] + "' allow filtering "
                res = [row.start.isoformat() for row in config.cassandra.session.execute(na_appointments).all()]
                res = sorted(res)
                if len(res) >= len(patients):
                    count = len(patients)
                    cancellation = False
                else:
                    count = len(res)
                    cancellation = True
                for i in range(count):
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
                        # Notification().notify_rescheduled_slots(doctor_email, patients[i])
                        threading.Thread(target=Notification().notify_rescheduled_slots, args=(doctor_email, patients[i])).start()
                if cancellation:
                    for patient in patients[count:]:
                        new_val = {
                            "session": "cancelled"
                        }
                        condition = "doctor_email = '{}' and patient_email = '{}' and start = '{}'".format(doctor_email,
                                                                                                           patient['email'],
                                                                                                           patient['date'])
                        res_2 = config.cassandra.update("medhub.doctor", new_val, condition)
                        if res_2:
                            # Notification().notify_cancelled_slots(doctor_email, patient)
                            threading.Thread(target=Notification().notify_cancelled_slots, args=(doctor_email, patient)).start()
                if res and res_1 and res_2:
                    return True
                else:
                    return False
        except Exception as e:
            config.logger.log("ERROR", str(e))






