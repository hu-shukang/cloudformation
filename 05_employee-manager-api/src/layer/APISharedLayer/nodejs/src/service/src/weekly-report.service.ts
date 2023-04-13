import { WeeklyReportDesc, WeeklyReportEntity, WeeklyReportForm } from 'model';
import { employeeRepository } from 'repository';
import { Const, dateUtil } from 'utils';

export class WeeklyReportService {
  public async addWeeklyReport(id: string, form: WeeklyReportForm) {
    const start = dateUtil.formatToYYYYMMDD(form.start);
    const end = dateUtil.formatToYYYYMMDD(form.end);
    const data: WeeklyReportEntity = {
      id: id,
      prop: `${Const.PROP_WEEKLY_REPORT}${Const.SPLIT}${start}${Const.SPLIT}${end}`,
      type: Const.PROP_WEEKLY_REPORT,
      start: form.start,
      end: form.end,
      workContent: JSON.stringify(form.workContent),
      problemAndSolution: JSON.stringify(form.problemAndSolution),
      study: JSON.stringify(form.study),
      matter: JSON.stringify(form.matter),
      comment: '',
    };
    await employeeRepository.putEmployee(data);
  }

  public async deleteWeeklyReport(id: string, start: string, end: string) {
    // WEEKLY_REPORT#start#end
    const prop = `${Const.PROP_WEEKLY_REPORT}${Const.SPLIT}${start}${Const.SPLIT}${end}`;
    const conditionExpression = 'attribute_not_exists(#inspection)';
    const expressionAttributeNames = {
      '#inspection': 'inspection',
    };
    await employeeRepository.deleteEmployeeRecord(id, prop, conditionExpression, expressionAttributeNames);
  }

  public async updateWeeklyReport(id: string, oldStart: string, oldEnd: string, form: WeeklyReportForm) {
    await this.deleteWeeklyReport(id, oldStart, oldEnd);
    await this.addWeeklyReport(id, form);
  }

  /**
   *
   * @param id 社員番号
   * @param date 年月
   */
  public async listWeeklyReport(id: string, date: number) {
    const yyyymm = dateUtil.formatToYYYYMM(date);
    const propPrefix = `${Const.PROP_WEEKLY_REPORT}${Const.SPLIT}${yyyymm}`;
    const projectionExpression = '#id, #prop, #type, #start, #end, #submit, #submitDate, #inspection, #inspectionDate';
    const expressionAttributeNames = {
      '#type': 'type',
      '#start': 'start',
      '#end': 'end',
      '#submit': 'submit',
      '#submitDate': 'submitDate',
      '#inspection': 'inspection',
      '#inspectionDate': 'inspectionDate',
    };
    const items = await employeeRepository.queryEmployeeByPropPrefix(
      id,
      propPrefix,
      projectionExpression,
      expressionAttributeNames
    );
    return items as WeeklyReportDesc[];
  }

  public async getWeeklyReport(id: string, start: string, end: string) {
    // WEEKLY_REPORT#start#end
    const prop = `${Const.PROP_WEEKLY_REPORT}${Const.SPLIT}${start}${Const.SPLIT}${end}`;
    const result = await employeeRepository.getEmployee<WeeklyReportEntity>(id, prop);
    return result;
  }
}
