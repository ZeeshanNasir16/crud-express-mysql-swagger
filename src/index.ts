import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import EmpController from '@/resources/employee/employee.controller';

const app = new App([new EmpController()], Number(process.env.PORT));

app.listen();
