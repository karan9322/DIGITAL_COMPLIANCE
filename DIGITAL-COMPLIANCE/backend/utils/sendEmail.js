// backend/utils/sendEmail.js
const sendEmail = require("../config/email");

exports.sendStudentNotification = async (studentEmail, status) => {
  const subject = "Compliance Status Update";
  const text = `Your compliance status has been updated to: ${status}`;
  await sendEmail(studentEmail, subject, text);
};
