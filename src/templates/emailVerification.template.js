
/**
 * EXE-NODE Email Verification Template
 *
 * Generates HTML and plain-text versions of the
 * verification email for better email compatibility.
 */

export const emailVerificationTemplate = ({ name, verificationUrl }) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your Email</title>
      </head>

      <body style="
        margin: 0;
        padding: 40px 16px;
        background-color: #f1f5f9;
        font-family: Arial, Helvetica, sans-serif;
        color: #1e293b;
      ">
        <div style="
          max-width: 560px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        ">

          <!-- Brand header -->
          <div style="
            background-color: #0f172a;
            padding: 28px;
            text-align: center;
          ">
            <h1 style="
              margin: 0;
              color: #ffffff;
              font-size: 25px;
              letter-spacing: 2px;
            ">
              EXE-NODE
            </h1>
            <p style="
              margin: 8px 0 0;
              color: #94a3b8;
              font-size: 13px;
            ">
              Secure Authentication Platform
            </p>
          </div>

          <!-- Email content -->
          <div style="padding: 36px 30px;">

            <h2 style="
              margin-top: 0;
              font-size: 23px;
              color: #0f172a;
            ">
              Welcome, ${escapeHtml(name)}!
            </h2>

            <p style="
              font-size: 15px;
              line-height: 1.7;
              color: #475569;
            ">
              Thank you for creating your EXE-NODE account.
              We're excited to have you with us.
            </p>

            <p style="
              font-size: 15px;
              line-height: 1.7;
              color: #475569;
            ">
              Please verify your email address to activate
              your account and complete your registration.
            </p>

            <!-- Verification button -->
            <div style="
              margin: 32px 0;
              text-align: center;
            ">
              <a href="${escapeHtml(verificationUrl)}" style="
                display: inline-block;
                padding: 15px 30px;
                background-color: #2563eb;
                color: #ffffff;
                text-decoration: none;
                font-size: 15px;
                font-weight: bold;
                border-radius: 7px;
              ">
                Verify My Email
              </a>
            </div>

            <p style="
              font-size: 13px;
              line-height: 1.7;
              color: #64748b;
            ">
              This verification link expires in
              <strong>15 minutes</strong>.
            </p>

            <p style="
              font-size: 13px;
              line-height: 1.7;
              color: #64748b;
            ">
              If the button doesn't work, copy and paste
              this URL into your browser:
              <br />
              <a href="${escapeHtml(verificationUrl)}"
                 style="color: #2563eb; word-break: break-all;">
                ${escapeHtml(verificationUrl)}
              </a>
            </p>

            <hr style="
              margin: 30px 0;
              border: none;
              border-top: 1px solid #e2e8f0;
            " />

            <p style="
              font-size: 12px;
              line-height: 1.7;
              color: #94a3b8;
            ">
              If you didn't create this account, you can safely
              ignore this email. Never share your verification
              link with anyone.
            </p>

          </div>

          <!-- Footer -->
          <div style="
            padding: 20px;
            background-color: #f8fafc;
            text-align: center;
          ">
            <p style="
              margin: 0;
              font-size: 12px;
              color: #94a3b8;
            ">
              © ${new Date().getFullYear()} EXE-NODE.
              All rights reserved.
            </p>
          </div>

        </div>
      </body>
    </html>
  `;

  // Plain-text fallback for email clients that don't support HTML.
  const text = `
Welcome to EXE-NODE, ${name}!

Thank you for creating your account.

Verify your email address using this link:

${verificationUrl}

This link expires in 15 minutes.

If you didn't create this account, ignore this email.

EXE-NODE - Secure Authentication Platform
  `.trim();

  return { html, text };
};

// Escape user-provided values before inserting them into HTML.
const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[character];
  });
