import { employeeRepository } from 'repository';
import { Const, cryptoUtil } from 'utils';
import { EmployeeInfoAddForm, EmployeeInfoEntity, EmployeeInfoUpdateForm } from 'model';

export class EmployeeService {
  /**
   * 社員情報を取得する
   *
   * @param id 社員番号
   */
  public async getEmployeeInfo(id: string) {
    const data = await employeeRepository.getEmployee<EmployeeInfoEntity>(id, Const.INFO);
  }

  public async addEmployee(form: EmployeeInfoAddForm) {
    const hash = cryptoUtil.hash(form.email);
    const data: any = {
      ...form,
      prop: Const.INFO,
      type: Const.INFO,
      hash: hash,
      status: Const.STATUS_ACTIVE,
    };
    delete data.email;
    await employeeRepository.putEmployee(data);
  }

  public async updateEmployeeInfo(id: string, form: EmployeeInfoUpdateForm) {
    await employeeRepository.updateEmployee(id, Const.INFO, form);
  }

  public async deleteEmployee(id: string) {
    await employeeRepository.deleteEmployee(id);
  }
}
