
import { sendVerificationEmail } from '../src/services/email.service.js';

// Manually test actual email delivery.
const run = async () => {
  try {
    const result = await sendVerificationEmail({
      to: process.env.EMAIL_USER,
      name: 'EXE-NODE Developer',
      verificationUrl: 'https://example.com/verify-email?token=test-token',
    });

    console.log('Verification email sent successfully.');
    console.log('Message ID:', result.messageId);
  } catch (error) {
    console.error('Email delivery failed:', error.message);
    process.exitCode = 1;
  }
};

run();
