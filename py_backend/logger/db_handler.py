from logging import Handler, LogRecord, getLogger
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
from dotenv import load_dotenv
import os


class DB_Handler(Handler):

    def __init__(self, level=0, backup_logger_name=None):
        """

        A log handler created to upload all log data to cassandra server.
        """
        super().__init__(level)

        cloud_config = {
            'secure_connect_bundle': r'py_backend/cassandra_db/secure-connect-ineuron.zip'}
        load_dotenv('py_backend/env/cassandra_credentials.env')
        client_id = os.getenv("CLIENT_ID")
        client_secret = os.getenv("CLIENT_SECRET")
        auth_provider = PlainTextAuthProvider(client_id, client_secret)
        cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider)
        self.session = cluster.connect()

        if backup_logger_name:
            self.backup_logger_name = backup_logger_name
            self.backup_logger = getLogger(backup_logger_name)

    def emit(self, record: LogRecord) -> None:
        try:
            create_table_query = "create table if not exists medhub.log(id bigint PRIMARY KEY, levelname text, message " \
                                 "text, name text, log_datetime text); "
            self.session.execute(create_table_query)
            get_max_id_query = "select max(id) from medhub.log"
            res = self.session.execute(get_max_id_query).one()[0]
            if res is not None:
                count = res + 1
            else:
                count = 1
            record = {
                "id": count,
                "levelname": record.levelname,
                "message": record.msg,
                "name": os.getlogin(),
                "log_datetime": self.format(record).split(" - ")[1]
            }
            col_name = ','.join(record.keys())
            values = ','.join(list(map(lambda x: "'" + x + "'" if type(x) == str else str(x), record.values())))
            query = "insert into " + "medhub.log" + " (" + col_name + ")" + " values (" + values + ")"
            self.session.execute(query)
        except Exception as e:
            print(e)
