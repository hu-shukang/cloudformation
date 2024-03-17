export class HttpError extends Error {
  private _statusCode: number;

  constructor(statusCode: number, message: string, name?: string) {
    super(message);
    this._statusCode = statusCode;
    this.name = name ?? 'HTTP_ERROR';
  }

  /**
   * レスポンスのステータスコード
   */
  get statusCode() {
    return this._statusCode;
  }
}

export default {
  badRequest: new HttpError(400, 'パラメーター不正', 'BAD_REQUEST'),
  unauthorized: new HttpError(401, '権限不正', 'UNAUTHORIZED'),
  internalServerError: new HttpError(500, 'サーバエラー', 'INTERNAL_SERVER_ERROR'),
};
