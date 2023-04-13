export type Option = {
  key: string;
  label: string;
};

export type AttributeMap = {
  [key: string]: any;
};

export type Op = {
  insert?: string | object;
  delete?: number;
  retain?: number;
  attributes?: AttributeMap;
};

export type Delta = {
  ops: Op[];
};

export type EmployeeBase = {
  /** 社員番号 */
  id: string;
  /** prop */
  prop: string;
  /** type */
  type: string;
};

/**
 * 休日
 * key: unix time
 * value: 名前
 */
export type Holidays = { [key: string]: string };
