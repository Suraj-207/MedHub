import datetime
import config
import numpy as np


class Convert:

    @staticmethod
    def convert_str_to_time(time_string):
        """

        :param time_string: str , e.g. - "10:00:00"
        :return: datetime.time() object
        """
        try:
            return datetime.time.fromisoformat(time_string)
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def convert_time_to_str(time):
        """

        :param time: datetime.time() object
        :return: str
        """
        try:
            return datetime.time.isoformat(time)
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def convert_str_to_timestamp(timestamp_string):
        """

        :param timestamp_string: str
        :return: datetime.datetime() object
        """
        try:
            timestamp_format = "%Y-%m-%dT%H:%M"
            return datetime.datetime.strptime(timestamp_string, timestamp_format)
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def convert_timestamp_to_str(timestamp):
        """

        :param timestamp: datetime.datetime() object
        :return: str
        """
        try:
            return timestamp.isoformat()
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def difference_between_timestamps_in_days(first_timestamp, second_timestamp):
        """

        :param first_timestamp: datetime.datetime() object
        :param second_timestamp: datetime.datetime() object
        :return: datetiem.timedelta().days
        """
        try:
            difference = first_timestamp - second_timestamp
            return abs(difference.days)
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def sessions_in_a_day(date, start_time, end_time, break_start, break_end, session):
        """

        :param date: datetime.date() object
        :param start_time: start time string
        :param end_time: end time string
        :param break_start: break start time string
        :param break_end: break end time string
        :param session: session per patient time string
        :return: list of appointments possible
        """
        try:
            if start_time != "NA" and end_time != "NA" and session != "NA":
                start_time = datetime.datetime.combine(date, Convert().convert_str_to_time(start_time))
                end_time = datetime.datetime.combine(date, Convert().convert_str_to_time(end_time))
                hours, minutes = [int(i) for i in session.split(':')]
                if break_start != "NA" and break_end != "NA":
                    break_start = datetime.datetime.combine(date, Convert().convert_str_to_time(break_start))
                    break_end = datetime.datetime.combine(date, Convert().convert_str_to_time(break_end))
                    appointments_before_break = list(iter(map(lambda x: x.astype(datetime.datetime).isoformat(), np.arange(start_time, break_start + datetime.timedelta(seconds=1), datetime.timedelta(hours=hours, minutes=minutes)))))
                    appointments_after_break = list(iter(map(lambda x: x.astype(datetime.datetime).isoformat(), np.arange(break_end, end_time + datetime.timedelta(seconds=1), datetime.timedelta(hours=hours, minutes=minutes)))))
                    return appointments_before_break[:-1] + appointments_after_break[:-1]
                else:
                    appointments = list(iter(map(lambda x: x.astype(datetime.datetime).isoformat(), np.arange(start_time, end_time + datetime.timedelta(seconds=1), datetime.timedelta(hours=hours, minutes=minutes)))))
                    return appointments[:-1]
            else:
                config.logger.log("CRITICAL", "Please set your appointment timings...")
        except Exception as e:
            config.logger.log("ERROR", str(e))
