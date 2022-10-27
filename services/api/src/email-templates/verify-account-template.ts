import { EmailTemplate } from './email-template';

export const verifyAccountTemplate: EmailTemplate = {
  subject: 'Welcome to Volca!',
  generateBody: ({ firstName, url }) => `
    <html>
      <body>
        Hey ${firstName}!<br/>
        <p>We are glad to see that you are checking out Volca for building your new SaaS application. Please reach out to us if you have any question or feedback for Volca. You can reach us at <a href="mailto:admin@volca.io">admin@volca.io</a> or via the chat function at <a href="https://volca.io">volca.io</a>.</p>
        <p>In the meantime, you can click this link to verify your account and continue to check out the Volca demo</p>
        <a href="${url}">${url}</a>
      </body>
    </html>
  `,
};
