/**
 * 社員情報Entity
 */
export type EmployeeInfoEntity = {
  /** 社員番号(一意) */
  id: string;
  /** prop */
  prop: string;
  /** type */
  type: string;
  /** 名前 */
  name: string;
  /** 所属部門ID */
  department: string;
  /** 直上司の社員番号 */
  bossId: string;
  /** 社員Hash値(一意、emailのmd5) */
  hash: string;
};

export type EmployeeInfoAddForm = {
  /** 社員番号(一意) */
  id: string;
  /** 名前 */
  name: string;
  /** 所属部門ID */
  department: string;
  /** 直上司の社員番号 */
  bossId: string;
  /** メールアドレス */
  email: string;
};

export type EmployeeInfoUpdateForm = {
  /** 名前 */
  name: string;
  /** 所属部門ID */
  department: string;
  /** 直上司の社員番号 */
  bossId: string;
};

export type EmpolyeeRecordWithInfo<T> = {
  info?: EmployeeInfoEntity;
  record?: T;
};
