import datetime
import threading
import config
from py_backend.appointment.notify import Notification
from py_backend.date_and_time.conversion import Convert


class BookCancelReschedule:

    @staticmethod
    def patient_book(patient_email, date, doctor_email, issue):
        """

        :param patient_email: email address of the patient
        :param date: date of booking in string format
        :param doctor_email: email address of doctor whose appointment is being booked
        :param issue: the reason of appointment
        :return: True, if appointment registration is successful else False
        """
        try:
            new_val = {
                "patient_email": patient_email,
                "status": "pending",
                "issue": issue
            }
            condition = "doctor_email = '{}' and start = '{}'".format(doctor_email, date)
            res = config.cassandra.update("medhub.appointment", new_val, condition)
            if res:
                threading.Thread(target=Notification().notify_book_slot, args=(doctor_email, patient_email, date)).start()
                return True
            else:
                return False
        except Exception as e:
            config.logger.log("ERROR", str(e))
            return False


    @staticmethod
    def patient_cancel(date, doctor_email):
        """

        :param date: date of cancellation
        :param doctor_email: email address of doctor whose appointment is to be cancelled
        :return: True , if cancellation is successful else False
        """
        try:
            difference = datetime.datetime.strptime(date, "%Y-%m-%dT%H:%M:%S") - datetime.datetime.now()
            if difference.days >= 3:
                new_val = {
                    "patient_email": "NA",
                    "status": "NA",
                    "issue": "NA"
                }
                condition = "doctor_email = '{}' and start = '{}'".format(doctor_email, date)
                res = config.cassandra.update("medhub.appointment", new_val, condition)
                if res:
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
        """

        :param doctor_email: email address of the doctor
        :param start: start datetime of leave in string format
        :param end: end datetime of leave in string format
        :param status: whether cancellation/rescheduling is to be done in case of leave
        :return: True if leave is successful else False
        """
        try:
            query = "select patient_email, start, issue from medhub.appointment where doctor_email = '{}' and start >= '{}' and " \
                    "start <= '{}' and status = 'pending' allow filtering".format(doctor_email, start, end)
            patients = [{
                "email": row.patient_email,
                "date": row.start.isoformat(),
                "issue": row.issue
            } for row in config.cassandra.session.execute(query).all()]
            if status == 'cancel':
                for patient in patients:
                    new_val = {
                        "status": "cancelled"
                    }
                    condition = "doctor_email = '{}' and start = '{}'".format(doctor_email, patient['date'])
                    res = config.cassandra.update("medhub.appointment", new_val, condition)
                    if res:
                        threading.Thread(target=Notification().notify_cancelled_slots, args=(doctor_email, patient)).start()
                        return True
                    else:
                        return False
            else:
                na_appointments = "select start from medhub.appointment where doctor_email = '" + doctor_email + "' and status  = 'NA' and " \
                                                                                                                 "start > '" + end + "' allow filtering "
                result = [row.start.isoformat() for row in config.cassandra.session.execute(na_appointments).all()]
                result = sorted(result)
                if len(result) >= len(patients):
                    count = len(patients)
                    cancellation = False
                else:
                    count = len(result)
                    cancellation = True
                for i in range(count):
                    new_val = {
                        "status": "rescheduled"
                    }
                    condition = "doctor_email = '{}' and start = '{}'".format(doctor_email, patients[i]['date'])
                    res = config.cassandra.update("medhub.appointment", new_val, condition)
                    new_val_1 = {
                        "status": "pending",
                        "patient_email": patients[i]['email'],
                        "issue": patients[i]['issue']
                    }
                    patients[i]['new_date'] = result[i]
                    condition_1 = "doctor_email = '{}' and start = '{}'".format(doctor_email, patients[i]['new_date'])
                    res_1 = config.cassandra.update("medhub.appointment", new_val_1, condition_1)
                    if res and res_1:
                        threading.Thread(target=Notification().notify_rescheduled_slots, args=(doctor_email, patients[i])).start()
                if cancellation:
                    for patient in patients[count:]:
                        new_val = {
                            "status": "cancelled"
                        }
                        condition = "doctor_email = '{}' and start = '{}'".format(doctor_email, patient['date'])
                        res_2 = config.cassandra.update("medhub.appointment", new_val, condition)
                        if res_2:
                            threading.Thread(target=Notification().notify_cancelled_slots, args=(doctor_email, patient)).start()
                return True
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def doctor_complete(doctor_email, date, diagnosis, prescription):
        try:
            new_val = {
                "status": "completed",
                "diagnosis": diagnosis,
                "prescription": prescription
            }
            condition = "doctor_email = '{}' and start = '{}'".format(doctor_email, date)
            res = config.cassandra.update("medhub.appointment", new_val, condition)
            if res:
                return True
            return False
        except Exception as e:
            config.logger.log("ERROR", str(e))
            return False








