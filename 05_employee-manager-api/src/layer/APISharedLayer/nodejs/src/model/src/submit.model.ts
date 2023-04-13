import { EmployeeBase, Holidays } from './common.model';
import { WorkRosterDetailVo } from './work.model';

export type SubmitInfoEntify = {
  /** 提出情報 */
  submit?: string;
  /** 提出日時 */
  submitDate?: number;
  /** 検収者の社員ID */
  inspection?: string;
  /** 検収日時 */
  inspectionDate?: number;
} & EmployeeBase;

export type SubmitInfoVo = {
  /** 提出日時 */
  submitDate?: number;
  /** 検収者の社員ID */
  inspection?: string;
  /** 検収日時 */
  inspectionDate?: number;
};

export type WorkRosterVo = {
  info: SubmitInfoVo;
  report: WorkRosterDetailVo[];
  holidays: Holidays;
};

export type SubmitItemVo = {
  /** 社員番号 */
  id: string;
  /** 名前 */
  name: string;
  /** 提出日時 */
  submitDate?: number;
  /** 検収者の社員ID */
  inspection?: string;
  /** 検収日時 */
  inspectionDate?: number;
};

export type SubmitListVo = { [key: string]: SubmitItemVo[] };
