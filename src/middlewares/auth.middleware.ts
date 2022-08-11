import { NextFunction, Response, Request } from 'express';
import { verify } from 'jsonwebtoken';
import { OPS } from '@config/secret';
import { HttpException } from '@exceptions/HttpException';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const Authorization =
            req.cookies['Authorization'] ||
            (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

        if (Authorization) {
            const secretKey: string = OPS.PUBKEY;
            const verificationResponse = verify(Authorization, secretKey, {
                algorithms: ['RS256'],
            });
            if (verificationResponse) {
                next();
            } else {
                next(new HttpException(401, 'Wrong authentication token'));
            }
        } else {
            next(new HttpException(404, 'Authentication token missing'));
        }
    } catch (error) {
        next(new HttpException(401, 'Wrong authentication token'));
    }
};

export default authMiddleware;
