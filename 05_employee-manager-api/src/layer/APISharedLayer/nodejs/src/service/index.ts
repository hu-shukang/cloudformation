import { EmployeeService } from './src/employee.service';
import { WorkRosterService } from './src/work-roster.service';
import { SubmitService } from './src/submit.service';
import { WeeklyReportService } from './src/weekly-report.service';

export const employeeService = new EmployeeService();
export const workRosterService = new WorkRosterService();
export const submitService = new SubmitService();
export const weeklyReportService = new WeeklyReportService();
