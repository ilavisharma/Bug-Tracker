const sgMail = require('@sendgrid/mail');
const { sendGrid_api_key, templateId_welcome } = require('./config');

sgMail.setApiKey(sendGrid_api_key);

const from = 'noreply-bugtrakcer@lavisharma.me';

const sendWelcomeMail = (to, password) =>
  sgMail.send({
    from,
    to,
    subject: 'Welcome',
    templateId: templateId_welcome,
    dynamicTemplateData: {
      subject: 'Setup Instructions',
      user_email: to,
      user_password: password
    }
  });

module.exports = { sendWelcomeMail };
