import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/employee/employee.validation';
import EmployeeService from '@/resources/employee/employee.service';
import { HTTPCodes } from '@/utils/helpers/response';
import catchAsync from '@/utils/helpers/catchAsync';

class UserController implements Controller {
  public path = '/employees';
  public router = Router();
  private EmpService = new EmployeeService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}`,
      validationMiddleware(validate.addEmployee),
      this.addEmp
    );
    this.router.get(`${this.path}`, this.getEmployees);
    this.router.get(`${this.path}/:id`, this.getEmpById);
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(validate.updateEmp),
      this.updateEmp
    );
    this.router.delete(`${this.path}/:id`, this.deleteEmp);
  }

  private addEmp = catchAsync(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const emp = await this.EmpService.addEmp(req.body);
      if (emp.affectedRows === 1)
        return res.status(HTTPCodes.CREATED).json({
          status: 'success',
          message: 'New Employee created successfully',
        });

      return next(
        new HttpException(HTTPCodes.SERVER_ERROR, "Couldn't add employee to db")
      );
    }
  );

  private getEmployees = catchAsync(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const employees = await this.EmpService.getAllEmps();

      res
        .status(HTTPCodes.OK)
        .json({ status: 'success', results: employees.length, employees });
    }
  );

  private getEmpById = catchAsync(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const { id } = req.params;

      if (isNaN(+id))
        return next(
          new HttpException(HTTPCodes.BAD_REQUEST, `Invalid Id: ${id}`)
        );

      const emp = await this.EmpService.getEmpById(id);

      if (!emp || emp.length === 0)
        return next(
          new HttpException(
            HTTPCodes.NOT_FOUND,
            `Cant find any employee with id ${id}`
          )
        );
      res.status(HTTPCodes.OK).json({ status: 'success', emp });
    }
  );

  private deleteEmp = catchAsync(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const { id } = req.params;

      if (isNaN(+id))
        return next(
          new HttpException(HTTPCodes.BAD_REQUEST, `Invalid Id: ${id}`)
        );

      const emp = await this.EmpService.deleteEmp(id);
      console.log(emp);
      if (emp.affectedRows === 0)
        return next(
          new HttpException(
            HTTPCodes.NOT_FOUND,
            `Cant find any employee with id ${id}`
          )
        );

      res.status(HTTPCodes.OK).json({
        status: 'success',
        message: `Employee with Id : ${id} deleted successfully`,
      });
    }
  );

  private updateEmp = catchAsync(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const { id } = req.params;

      if (isNaN(+id))
        return next(
          new HttpException(HTTPCodes.BAD_REQUEST, `Invalid Id: ${id}`)
        );

      const result = await this.EmpService.updateEmp(id, req.body);

      if (result.affectedRows === 0)
        return next(
          new HttpException(
            HTTPCodes.NOT_FOUND,
            `Cant find any employee with id ${id}`
          )
        );

      console.log(result);

      res.status(HTTPCodes.OK).json({
        status: 'success',
        message: `Employee with Id : ${id} updated successfully`,
      });
    }
  );
}

export default UserController;
