import { handler } from '../../../src/function/employee/weekly-report/add/index';
import sinon from 'sinon';

const sandbox = sinon.createSandbox();

afterEach(() => {
  sandbox.restore();
});

describe('weekly-report add', () => {
  describe('validate test', () => {
    it('型違い_01', async () => {
      const form: any = {
        start: 1660489200000,
        end: 1661007600000,
        workContent: { ops: [{ insert: 'dfdf\n' }] },
        problemAndSolution: { ops: [{ insert: 'dfdf\n' }] },
        study: { ops: [{ insert: '123\n' }] },
        matter: { ops: [{ insert: '22222\n' }] },
      };
      const event: any = {
        body: JSON.stringify(form),
      };
      const result = await handler(event, null as any, null as any);
      console.log(result);
    });
  });
});
