import { verifyEmailConnection } from '../src/services/email.service.js';

const testEmail = async () => {
  try {
    await verifyEmailConnection();
    console.log('Gmail SMTP test successful.');
  } catch (error) {
    console.error('Gmail SMTP test failed:', error.message);
    process.exitCode = 1;
  }
};

testEmail();