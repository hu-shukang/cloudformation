import { EmployeeBase } from './common.model';

export type WorkRosterEntity = {
  /** 日付 */
  date: number;
  /** 出勤 */
  in: string;
  /** 退勤 */
  out: string;
  /** 通常休憩 */
  break?: string;
  /** 深夜休憩 */
  midnightBreak?: string;
  /** 実働時間 */
  actualWorking: number;
  /** 精算時間 */
  settlement: number;
  /** 深夜残業 */
  midnightOvertime: number;
  /** 休暇 */
  timeOff?: string;
  /** 備考欄 */
  comment?: string;
} & EmployeeBase;

export type WorkRosterRow = {
  /** 日付 */
  date: number;
  /** 出勤 */
  in: string;
  /** 退勤 */
  out: string;
  /** 通常休憩 */
  break?: string;
  /** 深夜休憩 */
  midnightBreak?: string;
  /** 休暇 */
  timeOff?: string;
  /** 備考欄 */
  comment?: string;
};

export type WorkRosterForm = {
  list: WorkRosterRow[];
  date: number;
};

export type SubmitForm = {
  prop: string;
};

export type WorkRosterDetailVo = {
  /** 日付 */
  date: number;
  /** 出勤 */
  in: string;
  /** 退勤 */
  out: string;
  /** 通常休憩 */
  break?: string;
  /** 深夜休憩 */
  midnightBreak?: string;
  /** 実働時間 */
  actualWorking: number;
  /** 精算時間 */
  settlement: number;
  /** 深夜残業 */
  midnightOvertime: number;
  /** 休暇 */
  timeOff?: string;
  /** 備考欄 */
  comment?: string;
};
