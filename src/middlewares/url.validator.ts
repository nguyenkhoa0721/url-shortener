import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';

export const urlValidator = async (req: Request, res: Response, next: NextFunction) => {
    const bodySchema = Joi.object({
        url: Joi.string(),
        originalUrl: Joi.string(),
        active: Joi.boolean().optional().allow(null),
    });
    try {
        if (req.method === 'POST')
            await bodySchema.validateAsync(req.body, { presence: 'required' });
        else if (req.method === 'PATCH') await bodySchema.validateAsync(req.body);
        return next();
    } catch (err) {
        return res.status(500).json(err);
    }
};
