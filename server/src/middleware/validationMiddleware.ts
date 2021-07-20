import { plainToClass, ClassConstructor } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import HttpException from '../exceptions/HttpException';

function validationMiddleware<T extends object>(type: ClassConstructor<T>, skipMissingProperties = false): RequestHandler {
    return (req, _, next) => {
        validate(plainToClass<T, any>(type, req.body), { skipMissingProperties })
            .then((errors: ValidationError[]) => {
                if (errors.length > 0) {
                    const message = errors.map((error: ValidationError) => error.constraints && Object.values(error.constraints)).join(', ');
                    next(new HttpException(400, message));
                } else {
                    next();
                }
            });
    };
}

export default validationMiddleware;
