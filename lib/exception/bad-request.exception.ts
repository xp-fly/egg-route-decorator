import {HttpException} from './http.exception';
import {HttpStatus} from '../enum/http-status.enum';
import {createHttpExceptionBody} from '../utils/http-exception-body.util';

export class BadRequestException extends HttpException {
  constructor(message?: string | object | any, error = 'Bad Request') {
    super(
      message,
      HttpStatus.BAD_REQUEST,
      createHttpExceptionBody(message, error, HttpStatus.BAD_REQUEST),
    );
  }
}
