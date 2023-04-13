process.env.APPLICATION_NAME = 'EmployeeManagerAPI';
process.env.STAGE = 'Dev';

import { Const } from 'utils';
import { workRosterService } from '../index';

describe('work-roster service', () => {
  it('listSubmit', async () => {
    const result = await workRosterService.getWorkRoster(Const.EMPLOYEE_ID, 1659279600000);
    console.log(JSON.stringify(result));
  });
});
