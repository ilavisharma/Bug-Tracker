const sgMail = require('@sendgrid/mail');
const { sendGrid } = require('./config');

sgMail.setApiKey(sendGrid.apiKey);

const from = 'noreply-bugtrakcer@lavisharma.me';

const getRolename = role => {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'manager':
      return 'Project Manager';
    case 'developer':
      return 'Developer';
    case 'submitter':
      return 'Submitter';
  }
};

const sendWelcomeMail = (to, password) =>
  sgMail.send({
    from,
    to,
    templateId: sendGrid.templateId_welcome,
    dynamicTemplateData: {
      subject: 'Setup Instructions',
      user_email: to,
      user_password: password
    }
  });

const sendRoleChange = (to, name, role, changer) =>
  sgMail.send({
    from,
    to,
    templateId: sendGrid.templateId_roleChanged,
    dynamicTemplateData: {
      subject: 'User Role updated',
      user_name: name,
      changed_by: changer,
      user_role: getRolename(role)
    }
  });

const sendToNewManager = (to, name, projectName, assignedBy, projectId) =>
  sgMail.send({
    from,
    to,
    templateId: sendGrid.templateId_assignManager,
    dynamicTemplateData: {
      subject: 'You got a project',
      user_name: name,
      project_name: projectName,
      assigned_by: assignedBy,
      project_id: projectId
    }
  });

const sendForgotPassword = (to, link, name) =>
  sgMail.send({
    from,
    to,
    templateId: sendGrid.templateId_forgotPassword,
    dynamicTemplateData: {
      subject: 'Reset Bug Tracker password',
      user_name: name,
      reset_link: link
    }
  });

const sendGenericMail = (to, subject, message) =>
  sgMail.send({
    from,
    to,
    templateId: sendGrid.templateId_generic,
    dynamicTemplateData: {
      subject,
      message
    }
  });

module.exports = {
  sendWelcomeMail,
  sendRoleChange,
  sendToNewManager,
  sendForgotPassword,
  sendGenericMail
};
