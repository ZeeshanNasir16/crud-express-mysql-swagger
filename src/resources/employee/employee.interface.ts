export default interface User {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirm: string;
  role: string;

  // isValidPassword(password: string): Promise<Error | boolean>;
  // createAccountActivationLink(): string;
  // createPasswordResetToken(): string;
}
