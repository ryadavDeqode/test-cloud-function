/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
const sgMail = require('@sendgrid/mail')
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);
exports.helloPubSub = (event, context) => {
  sgMail.setApiKey(process.env.SENDGRID_KEY)
  const message = event.data
    ? Buffer.from(event.data, 'base64').toString()
    : 'Hello, World';
  const messageObj = JSON.parse(message)
  const receipient = messageObj.To
  const purpose = messageObj.Purpose
  switch (purpose) {
    case 'VERIFICATION':
      if (messageObj.MFASource !== 'mobile') {
        const otp = messageObj.Otp
        const msg = {
          to: receipient,
          from: process.env.SENDGRID_REGISTERED_EMAIL,
          templateId: process.env.VERIFICATION_TEMPLATE_ID,
          dynamicTemplateData: {
            subject: 'Verify Your Email',
            otp: otp
          },
        };
        sgMail.send(msg).then(console.log)
      } else {
        const otp = messageObj.Otp
        const msg = {
          body: `Your mobile verification code is ${otp}.The code is valid for 5 minutes`,
          from: process.env.TWILIO_REGISTERED_NUMBER,
          to: receipient
        };
        twilioClient.messages.create(msg).then(console.log);
      }
      break;
    case 'CHANGE_GUARDIAN':
      if (messageObj.MFASource !== 'mobile') {
        const otp = messageObj.Otp
        const msg = {
          to: receipient,
          from: process.env.SENDGRID_REGISTERED_EMAIL,
          templateId: process.env.VERIFICATION_TEMPLATE_ID,
          dynamicTemplateData: {
            subject: 'Verify Your Email',
            otp: otp
          },
        };
        sgMail.send(msg).then(console.log)
      } else {
        const otp = messageObj.Otp
        const msg = {
          body: `Your mobile verification code is ${otp}.The code is valid for 5 minutes`,
          from: process.env.TWILIO_REGISTERED_NUMBER,
          to: receipient
        };
        twilioClient.messages.create(msg).then(console.log);
      }
      break;
    case 'RESTORATION_INITIATED':
      if (messageObj.MFASource !== 'mobile') {
        const initiationTime = messageObj.TimeOfInitiation
        const msg = {
          to: receipient,
          from: process.env.SENDGRID_REGISTERED_EMAIL,
          templateId: process.env.RESTORATION_INITIATED_TEMPLATE_ID,
          dynamicTemplateData: {
            subject: 'Vault Restoration Initiated',
            initiationTime: initiationTime
          },
        };
        sgMail.send(msg).then(console.log)
      }
      break;
    case 'RESTORATION_VETOED':
      if (messageObj.MFASource !== 'mobile') {
        const guardianVetoed = messageObj.GuardianVeto
        const msg = {
          to: receipient,
          from: process.env.SENDGRID_REGISTERED_EMAIL,
          templateId: process.env.RESTORATION_VETOED_TEMPLATE_ID,
          dynamicTemplateData: {
            subject: 'Your Restoration is vetoed',
            guardianVetoed: guardianVetoed
          },
        };
        sgMail.send(msg).then(console.log)
      }
      break;
    case 'GUARDIAN_VETO':
      if (messageObj.MFASource !== 'mobile') {
        const msg = {
          to: receipient,
          from: process.env.SENDGRID_REGISTERED_EMAIL,
          templateId: process.env.GUARDIAN_VETO_TEMPLATE_ID,
          dynamicTemplateData: {
            subject: 'Vault Restoration Initiated',
            baseURL: process.env.VETO_BASE_URL,
            initiationTime: messageObj.TimeOfInitiation,
            restorationTime: messageObj.TimeOfRestoration,
            walletIdentifier: messageObj.WalletIdentifier,
            guardianIdentifier: messageObj.GuardianIdentifier
          },
        }
        sgMail.send(msg).then(console.log)
      }
      break;
    case 'ADD_GUARDIAN':
      if(messageObj.MFASource !== 'mobile') {
        const msg = {
          to: receipient,
          from: process.env.SENDGRID_REGISTERED_EMAIL,
          templateId: process.env.ADD_GUARDIAN_TEMPLATE,
          dynamicTemplateData: {
            subject: 'Vault Restoration Initiated',
            baseURL: process.env.ADD_GUARDIAN_BASE_URL,
            walletIdentifier: messageObj.WalletIdentifier,
            path: messageObj.Path
          },
        }
        sgMail.send(msg).then(console.log)
      }
  }
};
