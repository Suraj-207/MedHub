# MedHub
Online Doctor Visit Appointment Web Application.

# Description
This application allows patients to effortlessly book an appointment with their doctor within 15 days. After a slot is confirmed by a patient he/she is redirected to the payment portal where we the patient can pay using a variety of methods given, i.e., UPI, credit cards, debit cards, QR scanner, etc. All the payments are then transferred to the doctors account except a small amount of Rs.50 which we charge as a convenience fee. A patient in case of emergency can cancel his/her appointment before 3 days to appointment. In this case the patient will get a partial refund, i.e., the amount he paid minus our convenience fee. Doctor can also take a leave between for a specified period during which all patients can either be rescheduled or cancelled as per the choice of doctor. If rescheduled all the patients will be moved to the nearest empty slot and be notified via email and on the notification bar on patient homepage. For some reason if a rescheduling of all patients is not possible due to unavailability of slots the appointments are cancelled. The patients whose appointments are cancelled would get a full refund including the convenience fee. 
Doctors on signup provides a proof of his/her medical license as an attachment. Unless the proof is verified the doctor is not allowed to take appointments. The doctor also must add his account details so that transfers can take place. Doctors must set their working time along with how much time they want to give per patient. A break time is also added which is optional. A doctor can only take up to 30 appointments a day.
Admin can activate and deactivate doctors accounts in case of a dispute or unfair use of our application.

# Steps to run the application on your local machine-
Step 1 - Install docker desktop \n
Step 2 - git clone 
Step 3 - Go to the project directory. 
Step 4 - Run the following commands - -> docker-compose build -> docker-compose up -d 
Step 5 - Open browser and visit "localhost:80".

# Visit our site at - http://15.206.168.13/

# Watch our video to know more about the site - https://drive.google.com/file/d/1cgYe5lKUT10sQWEDFl1Yud9-rlR1NyCc/view?usp=sharing

#Important Documents
HLD - https://github.com/shubhamgantayat/MedHub/blob/main/Documents/HLD.docx
LLD - https://github.com/shubhamgantayat/MedHub/blob/main/Documents/LLD.docx
Software Architecture - https://github.com/shubhamgantayat/MedHub/blob/main/Documents/Software%20Architecture%20Document.docx
Wireframe - https://github.com/shubhamgantayat/MedHub/blob/main/Documents/wireframe.docx
Detailed Project Report - https://github.com/shubhamgantayat/MedHub/blob/main/Documents/Detailed%20Report.pptx

# For feedback - 
Shubham Gantayat - sgantayat9@gmail.com
Suraj Kumar - Suraj_207@outlook.com

# Visit our LinkedIn profiles at -
Suraj Kumar - https://www.linkedin.com/in/suraj-kumar-49b942182/
Shubham Gantayat - https://www.linkedin.com/in/shubham-gantayat-4617521b7/

