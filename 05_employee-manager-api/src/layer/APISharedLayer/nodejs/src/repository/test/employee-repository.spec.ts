process.env.APPLICATION_NAME = 'EmployeeManagerAPI';
process.env.STAGE = 'Dev';

import { employeeRepository } from '../index';

describe('employee repository', () => {
  it('getEmployeeRecordWithInfo', async () => {
    const result = await employeeRepository.getEmployeeRecordWithInfo('00001', 'test');
    console.log(JSON.stringify(result));
  });
});
