export interface EmailTemplate {
  subject: string;
  generateBody: (emailProps: Record<string, unknown>) => string;
}
