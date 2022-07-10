export interface Security {
  hashPassword(password: string): Promise<string>;
}
