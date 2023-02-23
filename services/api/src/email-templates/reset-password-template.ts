import { EmailTemplate } from "./email-template";

export const resetPasswordTemplate: EmailTemplate = {
  subject: 'Your reset password request',
  generateBody: ({ email, url }) => `
    <html>
      <body>
        Hello,<br/>
        <p>We have received a request to reset the password for your user ${email}. No changes have been made to your account yet. If you have not requested this, please ignore this email.</p>
        <p>You can reset your password by clicking the following link:</p>
        <a href="${url}">${url}</a>
      </body>
    </html>
  `,
};
