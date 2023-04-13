import { workTableAddAction } from './01_work_table_add.action';
import { workTableUpdateAction } from './02_work_table_update.action';
import { workTableMultiUpdateAction } from './03_work_table_multi_update.action';
import { workTableDeleteAction } from './04_work_table_delete.action';
import { workTableGetAction } from './05_work_table_get.action';
import { workTableQueryAction } from './06_work_table_query.action';
import { workTableScanAction } from './07_work_table_scan.action';
import { workTableTransactAction } from './08_work_table_transact.action';
import { workTableIndexAction } from './09_work_table_index.action';
import { rensyuTableDataAction } from './10_rensyu_table_data.action';
import { rensyuTableQueryDepAction } from './11_rensyu_table_query_dep.action';
import { rensyuTableGetEmpAction } from './12_rensyu_table_get_emp.action';
import { rensyuTableQueryDepEmpAction } from './13_rensyu_table_query_dep_emp.action';
import { rensyuTableQueryWorkAction } from './14_rensyu_table_query_work.action';
import { testDataAction } from './99_test_data.action';

const actionMap = {
  '01': workTableAddAction,
  '02': workTableUpdateAction,
  '03': workTableMultiUpdateAction,
  '04': workTableDeleteAction,
  '05': workTableGetAction,
  '06': workTableQueryAction,
  '07': workTableScanAction,
  '08': workTableTransactAction,
  '09': workTableIndexAction,
  '10': rensyuTableDataAction,
  '11': rensyuTableQueryDepAction,
  '12': rensyuTableGetEmpAction,
  '13': rensyuTableQueryDepEmpAction,
  '14': rensyuTableQueryWorkAction,
  '99': testDataAction,
};

const main = async () => {
  const actionName = process.argv[2];
  const result = await actionMap[actionName].action();
  console.log(result);
};

main();
