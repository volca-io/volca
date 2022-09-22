import { action as authnPasswordAction, schema as authnPasswordSchema } from './password';
import { action as registerAction, schema as registerSchema } from './register';
import { action as signOutAction } from './sign-out';
import { action as refreshAction } from './refresh';
import { action as authnResetPasswordAction, schema as authnResetPasswordSchema } from './reset-password';

export {
  authnPasswordAction,
  authnPasswordSchema,
  authnResetPasswordAction,
  authnResetPasswordSchema,
  registerAction,
  registerSchema,
  signOutAction,
  refreshAction,
};
