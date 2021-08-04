import smtplib
import ssl
import config


class SendMail:

    def __init__(self, sender_email, sender_password, receiver_email, message):
        try:
            self.port = 464
            self.smtp_server = "smtp.gmail.com"
            self.sender_email = sender_email
            self.sender_password = sender_password
            self.receiver_email = receiver_email
            self.message = message
        except Exception as e:
            config.logger.log("ERROR", str(e))

    def send(self):
        try:
            config.logger.log("INFO", "Sending confirmation mail to user...")
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(self.smtp_server, self.port, context=context) as server:
                server.login(self.sender_email, self.sender_password)
                server.sendmail(self.sender_email, self.receiver_email, self.message)
            config.logger.log("INFO", "Mail sent")
            return True
        except smtplib.SMTPRecipientsRefused:
            config.logger.log("Invalid mail provided")
            return False
        except Exception as e:
            config.logger.log("ERROR", str(e))
            return False
