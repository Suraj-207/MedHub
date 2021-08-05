import datetime
import config


class Convert:

    @staticmethod
    def convert_str_to_time(time_string):
        try:
            return datetime.time.fromisoformat(time_string)
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def convert_time_to_str(time):
        try:
            return datetime.time.isoformat(time)
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def convert_str_to_timestamp(timestamp_string):
        try:
            timestamp_format = "%Y-%m-%dT%I:%M%p"
            return datetime.datetime.strptime(timestamp_string, timestamp_format)
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def convert_timestamp_to_str(timestamp):
        try:
            return timestamp.isoformat()
        except Exception as e:
            config.logger.log("ERROR", str(e))

    @staticmethod
    def difference_between_timestamps_in_days(first_timestamp, second_timestamp):
        try:
            difference = first_timestamp - second_timestamp
            return abs(difference.days)
        except Exception as e:
            config.logger.log("ERROR", str(e))
