import { Option } from 'model';

export class Const {
  // table name
  public static EMPLOYEE_TABLE_NAME = `${process.env.APPLICATION_NAME}-${process.env.STAGE}-EmployeeTable`;
  public static MASTER_TABLE_NAME = `${process.env.APPLICATION_NAME}-${process.env.STAGE}-MasterTable`;

  // http
  public static HTTP_STATUS_400 = 400;
  public static HTTP_STATUS_401 = 401;
  public static ERROR_INVALIDATE_DATA = 'invalidate data';
  public static ERROR_LOGIN_REQUIRED = 'Login Required';

  // employee status
  public static STATUS_ACTIVE = '0';
  public static STATUS_DELETED = '1';

  // MasterTable Category
  public static CATEGORY = 'category';
  public static CATEGORY_HOLIDAYS = 'HOLIDAYS';

  // prop
  public static PROP = 'prop';
  public static PROP_WORK_ROSTER = 'WORK_ROSTER';
  public static PROP_WORK_ROSTER_INFO = 'WORK_ROSTER_INFO';
  public static PROP_WORK_ROSTER_DETAIL = 'WORK_ROSTER_DETAIL';
  public static PROP_WEEKLY_REPORT = 'WEEKLY_REPORT';
  public static PROP_WEEKLY_REPORT_INFO = 'WEEKLY_REPORT_INFO';
  public static PROP_WEEKLY_REPORT_DETAIL = 'WEEKLY_REPORT_DETAIL';

  // other
  public static DEFAULT_REGION = 'ap-northeast-1';
  public static INFO = 'INFO';
  public static SPLIT = '#';
  public static MIDNIGHT_START = '22:00';
  public static MIDNIGHT_END = '05:00';
  public static TIME_OFF_OPTIONS: Option[] = [
    { key: 'TO1', label: '有給' },
    { key: 'TO2', label: '半有給' },
    { key: 'TO3', label: '振替休日' },
    { key: 'TO4', label: '振替出勤' },
    { key: 'TO5', label: '特別休暇' },
    { key: 'TO6', label: '欠勤' },
    { key: 'TO7', label: '遅刻' },
    { key: 'TO8', label: '早退' },
    { key: 'TO9', label: 'その他' },
  ];

  public static BREAK_OPTIONS: Option[] = [
    { key: '30', label: '0.5時間' },
    { key: '60', label: '1.0時間' },
    { key: '90', label: '1.5時間' },
    { key: '120', label: '2.0時間' },
    { key: '150', label: '2.5時間' },
    { key: '180', label: '3.0時間' },
    { key: '210', label: '3.5時間' },
    { key: '240', label: '4.0時間' },
  ];
  public static PATTERN_HHmm = /^((([01]?[0-9]|2[0-3]):[0-5]?[0-9])|(24:(0|00))|)$/;
  public static PATTERN_TIME_OFF = Const.TIME_OFF_OPTIONS.map((option) => option.key).join('|');
  public static PATTERN_BREAK = Const.BREAK_OPTIONS.map((option) => option.key).join('|');

  // test用
  public static EMPLOYEE_ID = '00001';
}
