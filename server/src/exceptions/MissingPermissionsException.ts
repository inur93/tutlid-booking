import HttpException from './HttpException';

class MissingPermissionsException extends HttpException {
  constructor(message?: string) {
    super(401, message || 'Missing permission');
  }
}

export default MissingPermissionsException;
