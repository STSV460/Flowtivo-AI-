import { readMailConfig, smtpTransport, CONTACT_RECIPIENT } from '../server/mail.mjs';

const config = readMailConfig();
if (!config.enabled) {
  console.error('Email is not configured. Add your Google app password to SMTP_PASS in private .env. Never paste it in chat.');
  process.exitCode = 1;
} else {
  const transport = smtpTransport(config);
  try {
    await transport.verify();
    console.log('SMTP connected and authenticated.');
    if (process.argv.includes('--send-test')) {
      await transport.sendMail({
        from: { name: 'Flowtivo AI Website', address: config.from },
        to: CONTACT_RECIPIENT,
        subject: 'Flowtivo AI — website email delivery test',
        text: 'This is a test from your Flowtivo AI website. New message-form enquiries will be sent to this inbox with all submitted fields and the visitor as Reply-To.',
      });
      console.log(`Test email accepted for delivery to ${CONTACT_RECIPIENT}.`);
    } else console.log('No email sent. Run npm run mail:test to send a test notification.');
  } catch (error) {
    console.error(`Email check failed (${error.code || 'SMTP_ERROR'}). Check .env and your Google app password.`);
    process.exitCode = 1;
  } finally { transport.close(); }
}
