import HttpException from './HttpException';

class MissingPermissionsException extends HttpException {
  constructor(message?: string) {
    super(403, message || 'Missing permission');
  }
}

export default MissingPermissionsException;
