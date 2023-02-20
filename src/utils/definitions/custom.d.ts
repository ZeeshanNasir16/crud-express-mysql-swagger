import User from '@/resources/employee/employee.interface';

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}
