import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

export class DateUtil {
  constructor() {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault('Asia/Tokyo');
  }

  public current(): number {
    return dayjs().tz().valueOf();
  }

  public getMonthStart(origin?: number): number {
    return dayjs(origin).tz().startOf('month').valueOf();
  }

  public getMonthEnd(origin?: number): number {
    return dayjs(origin).tz().endOf('month').valueOf();
  }

  public formatToYYYYMMDD(origin?: number): string {
    return dayjs(origin).tz().format('YYYY-MM-DD');
  }

  public formatToYYYYMM(origin?: number): string {
    return dayjs(origin).tz().format('YYYY-MM');
  }

  public getDateFromHHmm(origin: string) {
    const date = `1970-01-01 ${origin}:00`;
    const result = dayjs(date, 'YYYY-MM-DD HH:mm:ss').tz();
    return result.toDate();
  }

  public diffMinute(from: Date, to: Date) {
    const fromDayjs = dayjs(from).set('second', 0);
    const toDayjs = dayjs(to).set('second', 0);
    return Math.abs(fromDayjs.diff(toDayjs, 'minute'));
  }

  public roundMinuiteBySettlementUnit(origin: number, unit: number = 15) {
    return Math.floor(origin / unit) * unit;
  }

  public isAfter(origin: Date, target: Date) {
    return dayjs(origin).isAfter(target);
  }
}
