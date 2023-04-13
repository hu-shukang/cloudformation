import { Delta } from './common.model';
import { SubmitInfoEntify } from './submit.model';

export type WeeklyReportForm = {
  /** 開始日 */
  start: number;
  /** 終了日 */
  end: number;
  /** 作業内容 */
  workContent: Delta;
  /** 課題と解決策 */
  problemAndSolution: Delta;
  /** 学びと気づき */
  study: Delta;
  /** 報告・相談事項 */
  matter: Delta;
};

export type WeeklyReportEntity = {
  /** 開始日 */
  start: number;
  /** 終了日 */
  end: number;
  /** 作業内容 */
  workContent: string;
  /** 課題と解決策 */
  problemAndSolution: string;
  /** 学びと気づき */
  study: string;
  /** 報告・相談事項 */
  matter: string;
  /** コメント */
  comment: string;
} & SubmitInfoEntify;

export type WeeklyReportDesc = {
  /** 開始日 */
  prop: string;
  /** 開始日 */
  start: number;
  /** 終了日 */
  end: number;
} & SubmitInfoEntify;
