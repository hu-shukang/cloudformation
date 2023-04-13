import Ajv, { JSONSchemaType, KeywordCxt } from 'ajv';
import AjvErrors from 'ajv-errors';
import addFormats from 'ajv-formats';
import ValidationError from 'ajv/dist/runtime/validation_error';
import { HttpError, ValidateInfoModel } from 'model';
import { ValidateError } from 'model';
import { Const } from './const.util';
import { isBlank } from 'underscore.string';
import { dateUtil } from '..';

const checkAfter = (schema: any, data: string) => {
  if (isBlank(schema) || isBlank(data)) {
    return true;
  }
  const before = dateUtil.getDateFromHHmm(schema);
  const after = dateUtil.getDateFromHHmm(data);
  return dateUtil.isAfter(after, before);
};

export class ValidatorUtil {
  protected ajv: Ajv;
  constructor() {
    const ajv = new Ajv({ allErrors: true, $data: true });
    addFormats(ajv);
    ajv.addFormat('HHmm', Const.PATTERN_HHmm);
    ajv.addKeyword({
      keyword: 'after',
      type: 'string',
      $data: true,
      validate: checkAfter,
    });
    this.ajv = AjvErrors(ajv);
  }

  private getErrors<T>(errors: any[]): ValidateInfoModel[] {
    const errorList = [];
    if (errors.length > 0) {
      for (const error of errors) {
        let props = [];
        if (error.instancePath) {
          props.push(error.instancePath);
        }
        if (
          error.params &&
          error.params.errors &&
          error.params.errors.length > 0 &&
          error.params.errors[0].params.missingProperty
        ) {
          props.push(error.params.errors[0].params.missingProperty);
        }
        const message = error.message || '';
        let property = props.join('/');
        if (property.startsWith('/')) {
          property = property.substring(1);
        }
        if (isBlank(property)) {
          property = '/';
        }
        errorList.push({
          property: property,
          message: message,
        });
      }
    }
    return errorList;
  }

  public parse<T>(schema: JSONSchemaType<T>, body: string | null): T {
    if (!body) {
      throw new HttpError(Const.HTTP_STATUS_400, Const.ERROR_INVALIDATE_DATA);
    }
    let data: any = {};
    try {
      data = JSON.parse(body);
    } catch (e: any) {
      throw new HttpError(Const.HTTP_STATUS_400, Const.ERROR_INVALIDATE_DATA);
    }
    const validate = this.ajv.compile<T>(schema);
    try {
      const result = validate(data);
      if (result) {
        return data as T;
      }
      throw new ValidationError(validate.errors as any[]);
    } catch (e: any) {
      if (e.constructor.name == 'ValidationError') {
        const errors = this.getErrors(e.errors as any[]);
        throw new ValidateError(errors);
      }
      throw new HttpError(Const.HTTP_STATUS_400, Const.ERROR_INVALIDATE_DATA);
    }
  }
}
