
import nodemailer from 'nodemailer';

import { env } from '../config/env.js';
import {
  emailVerificationTemplate,
} from '../templates/emailVerification.template.js';

// Configure the Gmail SMTP transporter.
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE === 'true',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

// Check whether Gmail SMTP is accessible.
export const verifyEmailConnection = async () => {
  await transporter.verify();
  console.log('Email SMTP connection established successfully.');
};

// General-purpose email sender.
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  return transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
};

// Send a branded account verification email.
export const sendVerificationEmail = async ({
  to,
  name,
  verificationUrl,
}) => {
  const { html, text } = emailVerificationTemplate({
    name,
    verificationUrl,
  });

  // Reuse the general-purpose email sender.
  return sendEmail({
    to,
    subject: 'Verify your EXE-NODE account',
    html,
    text,
  });
};
