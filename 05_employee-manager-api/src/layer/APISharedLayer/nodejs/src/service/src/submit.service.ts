import { SubmitForm, SubmitInfoEntify, HttpError, EmployeeInfoEntity, SubmitListVo, SubmitItemVo } from 'model';
import { employeeRepository } from 'repository';
import { dateUtil, Const } from 'utils';

export class SubmitService {
  /**
   * レポートを提出する
   *
   * @param id 社員番号
   * @param form SubmitForm
   */
  public async submit(id: string, form: SubmitForm) {
    const prop = form.prop;
    const result = await employeeRepository.getEmployeeRecordWithInfo<SubmitInfoEntify>(id, prop);
    if (result.info == undefined) {
      throw new HttpError(400, 'ユーザ情報がないため、提出できません');
    }
    if (result.record == undefined) {
      throw new HttpError(400, 'レポートはまだ作成してないため、提出できません');
    }
    const { bossId } = result.info;
    // submit: bossId#YYYYMM
    const yyyymm = this.getYYYYMMFromProp(form);
    await employeeRepository.updateEmployee(id, prop, {
      submit: `${bossId}${Const.SPLIT}${yyyymm}`,
      submitDate: dateUtil.current(),
    });
  }

  /**
   * レポートの提出を取り消し
   *
   * @param id 社員番号
   * @param form SubmitForm
   */
  public async unsubmit(id: string, form: SubmitForm) {
    const prop = form.prop;
    const report = await employeeRepository.getEmployee<SubmitInfoEntify>(id, prop);
    if (report == undefined) {
      throw new HttpError(400, 'レポートはまだ作成してないため、提出を取り消しできません');
    }
    if (report.inspectionDate != undefined) {
      throw new HttpError(400, 'レポートは既に検収されたため、提出を取り消しできません');
    }
    delete report.submit;
    delete report.submitDate;
    delete report.inspection;
    delete report.inspectionDate;
    await employeeRepository.putEmployee(report);
  }

  public async listSubmit(id: string, date: number) {
    const yyyymm = dateUtil.formatToYYYYMM(date);
    const submit = `${id}${Const.SPLIT}${yyyymm}`;
    const result = await Promise.all([
      employeeRepository.queryEmployeeByBossId(id),
      employeeRepository.querySubmitInfo(submit),
    ]);
    return this.getWorkRosterListVo(result[0], result[1]);
  }

  private getWorkRosterListVo(
    employeeInfoList: EmployeeInfoEntity[],
    submitInfoList: SubmitInfoEntify[]
  ): SubmitListVo {
    if (employeeInfoList == undefined || employeeInfoList.length == 0) {
      return {};
    }
    const types = [Const.PROP_WORK_ROSTER_INFO, Const.PROP_WEEKLY_REPORT_INFO];
    const map = new Map<string, Map<string, SubmitItemVo>>();
    for (const employeeInfo of employeeInfoList) {
      for (const type of types) {
        const subMap = map.get(type) ?? new Map<string, SubmitItemVo>();
        subMap.set(employeeInfo.id, {
          id: employeeInfo.id,
          name: employeeInfo.name,
        });
        map.set(type, subMap);
      }
    }
    for (const submitInfo of submitInfoList) {
      const subMap = map.get(submitInfo.type)!;
      const item = subMap.get(submitInfo.id);
      if (item) {
        item.inspection = submitInfo.inspection;
        item.inspectionDate = submitInfo.inspectionDate;
        item.submitDate = submitInfo.submitDate;
        subMap.set(submitInfo.id, item);
        map.set(submitInfo.type, subMap);
      }
    }
    const result: SubmitListVo = {};
    map.forEach((value, key) => {
      result[key] = Array.from(value.values()).sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    });
    return result;
  }

  private getYYYYMMFromProp(form: SubmitForm) {
    const propArr = form.prop.split(Const.SPLIT);
    let date: string = propArr[1];
    return date.substring(0, 7);
  }
}
