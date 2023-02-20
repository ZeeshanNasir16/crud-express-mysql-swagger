import mysql from '@/utils/helpers/dbconnection';
import bcrypt from 'bcrypt';

class EmployeeService {
  private async encryptPassword(pass: string): Promise<any> {
    const open_password = await bcrypt.hash(pass, 10);
    return open_password;
  }

  public async addEmp(
    body: Body & {
      fullname: string;
      email: string;
      password: string;
      salary: number;
      role: string;
      address: string;
    }
  ): Promise<any> {
    const { fullname, email, password, salary, role, address } = body;
    const open_password = await this.encryptPassword(password);
    const res = await mysql.executeQuery(
      'INSERT INTO employees (fullname, email, password, salary, open_password, role, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [fullname, email, password, salary, open_password, role, address]
    );

    return res;
  }

  public async getAllEmps(): Promise<any> {
    const res = await mysql.executeQuery('Select * from employees');
    return res;
  }

  public async getEmpById(id: string): Promise<any> {
    const res = await mysql.executeQuery(
      'Select * from employees where emp_id = ?',
      [id]
    );
    return res;
  }

  public async updateEmp(id: string, body: Body): Promise<any> {
    let query = 'UPDATE employees SET ';
    let queryParams = [];
    let fieldsToUpdate = [];

    for (const [key, value] of Object.entries(body)) {
      if (key === 'password') {
        let excryptedPass = await this.encryptPassword(value);
        fieldsToUpdate.push('password = ?', 'open_password = ?');
        queryParams.push(value, excryptedPass);
      }
      fieldsToUpdate.push(`${key} = ?`);
      queryParams.push(value);
    }

    query += fieldsToUpdate.join(', ');
    query += ' WHERE emp_id = ?';
    queryParams.push(id);
    console.log(queryParams);

    const res = await mysql.executeQuery(query, queryParams);
    return res;
  }

  public async deleteEmp(id: string): Promise<any> {
    const res = await mysql.executeQuery(
      'Delete from employees where emp_id = ?',
      [id]
    );
    return res;
  }
}

export default EmployeeService;
