import HttpException from './HttpException';

class MissingPermissionsException extends HttpException {
  constructor() {
    super(401, 'Missing permission');
  }
}

export default MissingPermissionsException;