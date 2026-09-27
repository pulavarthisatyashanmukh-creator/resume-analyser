/**
 * contactController.js
 * Controller handling user contact and feedback submissions.
 */

const { contactMessagesStore } = require("../utils/storage");

/**
 * POST /api/contact
 * Accepts { name, email, subject, message }
 */
function submitContact(req, res) {
  const { name, email, subject, message } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: "MISSING_NAME",
        message: "Please provide your name."
      }
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_EMAIL",
        message: "Please provide a valid email address."
      }
    });
  }

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: "MISSING_MESSAGE",
        message: "Message content cannot be empty."
      }
    });
  }

  const contactRecord = {
    id: `msg_${Date.now().toString(36)}_${process.hrtime.bigint().toString(36)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject ? subject.trim() : "No Subject",
    message: message.trim(),
    receivedAt: new Date().toISOString()
  };

  contactMessagesStore.push(contactRecord);

  return res.status(200).json({
    success: true,
    message: "Thank you for contacting us. Your message has been received.",
    data: {
      id: contactRecord.id,
      name: contactRecord.name,
      email: contactRecord.email,
      subject: contactRecord.subject,
      receivedAt: contactRecord.receivedAt
    }
  });
}

module.exports = {
  submitContact
};
