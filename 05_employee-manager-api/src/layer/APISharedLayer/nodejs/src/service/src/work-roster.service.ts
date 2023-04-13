import {
  WorkRosterDetailVo,
  WorkRosterEntity,
  WorkRosterForm,
  SubmitInfoEntify,
  WorkRosterRow,
  WorkRosterVo,
} from 'model';
import { employeeRepository, masterRepository } from 'repository';
import { isBlank } from 'underscore.string';
import { Const, dateUtil } from 'utils';

export class WorkRosterService {
  /**
   * 指定月の勤務表情報を取得する
   *
   * @param id 社員番号
   * @param date 月のunix time
   * @returns WorkRosterVo
   */
  public async getWorkRoster(id: string, date: number): Promise<WorkRosterVo> {
    const start = dateUtil.getMonthStart(date);
    const end = dateUtil.getMonthEnd(date);
    const month = dateUtil.formatToYYYYMM(date);
    const prop = `${Const.PROP_WORK_ROSTER}${Const.SPLIT}${month}`;
    const result = await Promise.all([
      employeeRepository.queryEmployeeByPropPrefix(id, prop),
      masterRepository.selectHolidaysByRange(start, end),
    ]);
    return this.getWorkRosterVo(result);
  }

  public async addWorkRoster(id: string, form: WorkRosterForm) {
    const entities: WorkRosterEntity[] = form.list.map((row) => {
      const actualWorking = this.calcActualWorking(row);
      const settlement = dateUtil.roundMinuiteBySettlementUnit(actualWorking);
      const midnightOvertime = this.calcMidnightOvertime(row);
      const date = dateUtil.formatToYYYYMMDD(row.date);
      return {
        ...row,
        prop: `${Const.PROP_WORK_ROSTER}${Const.SPLIT}${date}`,
        type: Const.PROP_WORK_ROSTER_DETAIL,
        actualWorking: actualWorking,
        settlement: settlement,
        midnightOvertime: midnightOvertime,
        id: id,
      };
    });
    const month = dateUtil.formatToYYYYMM(form.date);
    const workRosterInfo: SubmitInfoEntify = {
      id: id,
      prop: `${Const.PROP_WORK_ROSTER}${Const.SPLIT}${month}`,
      type: Const.PROP_WORK_ROSTER_INFO,
    };
    const promiseList: Promise<void>[] = [employeeRepository.putEmployee(workRosterInfo)];
    entities.forEach((entity) => {
      promiseList.push(employeeRepository.putEmployee(entity));
    });
    await Promise.all(promiseList);
  }

  private calcActualWorking(row: WorkRosterRow) {
    if (isBlank(row.in) || isBlank(row.out)) {
      return 0;
    }
    const inTime = dateUtil.getDateFromHHmm(row.in);
    const outTime = dateUtil.getDateFromHHmm(row.out);
    let minute = dateUtil.diffMinute(inTime, outTime);
    if (row.break) {
      minute = minute - Number.parseInt(row.break);
    }
    if (row.midnightBreak) {
      minute = minute - Number.parseInt(row.midnightBreak);
    }
    return minute;
  }

  private calcMidnightOvertime(row: WorkRosterRow) {
    if (isBlank(row.in) || isBlank(row.out)) {
      return 0;
    }
    const inTime = dateUtil.getDateFromHHmm(row.in);
    const outTime = dateUtil.getDateFromHHmm(row.out);
    const midnightStart = dateUtil.getDateFromHHmm(Const.MIDNIGHT_START);
    const midnightEnd = dateUtil.getDateFromHHmm(Const.MIDNIGHT_END);
    let minutes = 0;
    if (dateUtil.isAfter(outTime, midnightStart)) {
      minutes += dateUtil.diffMinute(outTime, midnightStart);
    }
    if (dateUtil.isAfter(midnightEnd, inTime)) {
      minutes += dateUtil.diffMinute(midnightEnd, inTime);
    }
    if (row.midnightBreak) {
      minutes = minutes - Number.parseInt(row.midnightBreak);
    }
    if (minutes < 0) {
      minutes = 0;
    }
    return dateUtil.roundMinuiteBySettlementUnit(minutes);
  }

  private getWorkRosterVo(resultAll: any[]): WorkRosterVo {
    const workRosterList = resultAll[0] as any[];
    const result: any = {
      holidays: resultAll[1],
    };
    const report: WorkRosterDetailVo[] = [];
    for (const workRoster of workRosterList) {
      const type = workRoster.type;
      delete workRoster.id;
      delete workRoster.prop;
      delete workRoster.type;
      if (type == Const.PROP_WORK_ROSTER_INFO) {
        result.info = workRoster;
      } else if (type == Const.PROP_WORK_ROSTER_DETAIL) {
        report.push(workRoster);
      }
    }
    result.report = report.sort((a, b) => a.date - b.date);
    return result;
  }
}
