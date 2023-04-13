process.env.APPLICATION_NAME = 'EmployeeManagerAPI';
process.env.STAGE = 'Dev';

import { Const } from 'utils';
import { weeklyReportService } from '../index';

describe('weekly-report service', () => {
  it('listWeeklyReport', async () => {
    const result = await weeklyReportService.listWeeklyReport(Const.EMPLOYEE_ID, 1660715246377);
    console.log(result);
  });
});
