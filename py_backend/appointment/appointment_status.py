import datetime
import threading
import config
from py_backend.appointment.notify import Notification
from py_backend.payments.razorpay import Payment


class BookCancelReschedule:

    @staticmethod
    def patient_book_confirm(patient_email, date, doctor_email, pay_id):
        """

        :param patient_email: email of patient
        :param date: date of appointment
        :param doctor_email: email of doctor
        :param pay_id: payment id generated after payment by the patient
        :return: message whether the slot was booked successfully or not
        """
        try:
            if pay_id is not None:
                new_val = {
                    "status": "pending",
                    "pay_id": pay_id
                }
                condition = "doctor_email = '{}' and start = '{}'".format(doctor_email, date)
                res = config.cassandra.update("medhub.appointment", new_val, condition)
                payment = Payment()
                if res:
                    threading.Thread(target=Notification().notify_book_slot, args=(doctor_email, patient_email, date)).start()
                    fetch_acc_id_query = "select acc_id from medhub.doctor where email = '" + doctor_email + "' allow filtering"
                    fetch_acc_id = config.cassandra.session.execute(fetch_acc_id_query).one()
                    payment.transfer(fetch_acc_id.acc_id, pay_id)
                    return "Slot booked successfully"
                else:
                    payment.refund(pay_id)
                    return "Couldn't book slot. Refunding money back to your account"
            else:
                new_val = {
                    "patient_email": "NA",
                    "status": "NA",
                    "issue": "NA"
                }
                condition = "doctor_email = '{}' and start = '{}'".format(doctor_email, date)
                res = config.cassandra.update("medhub.appointment", new_val, condition)
                if res:
                    return "Couldn't book slot"
        except Exception as e:
            config.logger.log("ERROR", str(e))
            return False


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
                "status": "in process",
                "issue": issue,
                "pay_time": datetime.datetime.now().isoformat()[:-7]
            }
            condition = "doctor_email = '{}' and start = '{}'".format(doctor_email, date)
            re_check_query = "select status from medhub.appointment where " + condition + " allow filtering"
            if config.cassandra.session.execute(re_check_query).one().status == 'NA':
                res = config.cassandra.update("medhub.appointment", new_val, condition)
                if res:
                    config.logger.log("INFO", "payment in process..")
                    fetch_patient_name_query = "select fname, lname from medhub.user where email = '" + patient_email +"' allow filtering"
                    fetch_patient_phone_query = "select phone from medhub.patient where email = '" + patient_email +"' allow filtering"
                    fetch_doctor_amount_query = "select amount from medhub.doctor where email = '" + doctor_email + "' allow filtering"
                    fetch_patient_name = config.cassandra.session.execute(fetch_patient_name_query).one()
                    fetch_patient_phone = config.cassandra.session.execute(fetch_patient_phone_query).one()
                    fetch_doctor_amount = config.cassandra.session.execute(fetch_doctor_amount_query).one()
                    return Payment().get_link(fetch_patient_name.fname + " " + fetch_patient_name.lname, patient_email, fetch_patient_phone.phone, fetch_doctor_amount.amount + 50, doctor_email, date)
                else:
                    return False
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
                print(1)
                for patient in patients:
                    new_val = {
                        "status": "cancelled"
                    }
                    condition = "doctor_email = '{}' and start = '{}'".format(doctor_email, patient['date'])
                    pay_id_fetch_query = "select pay_id from medhub.appointment where doctor_email = '" + doctor_email + "' and start = '" + patient['date'] + "' allow filtering"
                    pay_id_fetch = config.cassandra.session.execute(pay_id_fetch_query).one()
                    res = config.cassandra.update("medhub.appointment", new_val, condition)
                    if res:
                        Payment().refund(pay_id_fetch.pay_id)
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
                        pay_id_fetch_query = "select pay_id from medhub.appointment where doctor_email = '" + doctor_email + "' and start = '" + patient['date'] + "' allow filtering"
                        pay_id_fetch = config.cassandra.session.execute(pay_id_fetch_query).one()
                        res_2 = config.cassandra.update("medhub.appointment", new_val, condition)
                        if res_2:
                            threading.Thread(target=Notification().notify_cancelled_slots, args=(doctor_email, patient)).start()
                            Payment().refund(pay_id_fetch.pay_id)
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

    @staticmethod
    def routine_check_for_failed_appointments():
        """
        Routine check for failed payments
        :return: None
        """
        try:
            query = "select doctor_email, start, pay_time from medhub.appointment where status = 'in process' allow filtering"
            for row in config.cassandra.session.execute(query).all():
                time_passed = datetime.datetime.now() - row.pay_time
                if time_passed.total_seconds() >= 3600:
                    new_val = {
                        "status": "pending",
                        "issue": "NA",
                        "patient_email": "NA"
                    }
                    condition = "doctor_email = '{}' and start = '{}'".format(row.doctor_email, row.start)
                    config.cassandra.update("medhub.appointment", new_val, condition)
        except Exception as e:
            config.logger.log("ERROR", str(e))








