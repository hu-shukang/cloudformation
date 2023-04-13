import { handler } from '../../../src/function/employee/work-roster/add/index';
import sinon from 'sinon';
import { workRosterService } from 'service';

const sandbox = sinon.createSandbox();

afterEach(() => {
  sandbox.restore();
});

describe('work-roster add', () => {
  describe('正常系', () => {
    it('001', async () => {
      const form: any = {
        date: 1660143600000,
        list: [
          {
            break: '',
            comment: '',
            date: 1660143600000,
            in: '',
            midnightBreak: '',
            out: '',
            timeOff: '',
          },
        ],
      };
      const event: any = {
        body: JSON.stringify(form),
      };
      const addWorkRosterStub = sandbox.stub(workRosterService, 'addWorkRoster');
      addWorkRosterStub.resolves();
      const result = await handler(event, null as any, null as any);
      console.log(result);
    });
  });
  describe('validate test', () => {
    it('request bodyは空', async () => {
      const form: any = {};
      const event: any = {
        body: JSON.stringify(form),
      };
      const result = await handler(event, null as any, null as any);
      expect(result).toStrictEqual({
        statusCode: 400,
        body: JSON.stringify({
          error: [
            { property: 'date', message: '年月は必須項目です' },
            { property: 'list', message: '勤務詳細は必須項目です' },
          ],
        }),
      });
    });
    it('型違い_01', async () => {
      const form: any = {
        date: 'abc',
        list: true,
      };
      const event: any = {
        body: JSON.stringify(form),
      };
      const result = await handler(event, null as any, null as any);
      expect(result).toStrictEqual({
        statusCode: 400,
        body: JSON.stringify({
          error: [
            { property: 'date', message: '日付は数値型です' },
            { property: 'list', message: '詳細情報は配列型です' },
          ],
        }),
      });
    });

    it('型違い_02', async () => {
      const form: any = {
        date: 1659279600000,
        list: [
          {
            date: 'asf',
            in: true,
            out: {},
            break: 1,
            midnightBreak: true,
            timeOff: 11,
            comment: false,
          },
        ],
      };
      const event: any = {
        body: JSON.stringify(form),
      };
      const result = await handler(event, null as any, null as any);
      expect(result).toStrictEqual({
        statusCode: 400,
        body: JSON.stringify({
          error: [
            { property: 'list/0/date', message: '日付は数値型です' },
            { property: 'list/0/in', message: '出勤は文字列型です' },
            { property: 'list/0/out', message: '退勤は文字列型です' },
            { property: 'list/0/break', message: '通常休憩は文字列型です' },
            { property: 'list/0/midnightBreak', message: '深夜休憩は文字列型です' },
            { property: 'list/0/timeOff', message: '休暇は文字列型です' },
            { property: 'list/0/comment', message: 'コメントは文字列型です' },
          ],
        }),
      });
    });

    it('型違い_03', async () => {
      const form: any = {
        date: 1659279600000,
        list: [
          {
            date: 1659279600000,
            in: '09:00',
            out: '09:01',
          },
          {
            date: 1659366000000,
            in: '19:00',
            out: '18:00',
          },
        ],
      };
      const event: any = {
        body: JSON.stringify(form),
      };
      const result = await handler(event, null as any, null as any);
      expect(result).toStrictEqual({
        statusCode: 400,
        body: JSON.stringify({
          error: [{ property: 'list/1/out', message: '出勤より後の時刻を入れて下さい' }],
        }),
      });
    });
  });
});
