import { NextFunction, Request, Response } from 'express';
import UrlService from '@/services/url.service';
import { HOMEPAGE } from '@config/index';

class UrlController {
    public urlService = new UrlService();

    public createNewUrl = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const url = await this.urlService.createNewUrl(req.body.originalUrl, req.body.url);
            return res.status(200).json(url);
        } catch (error) {
            next(error);
        }
    };

    public getUrlById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const url = await this.urlService.getUrlById(req.params.id);
            return res.status(200).json(url);
        } catch (error) {
            next(error);
        }
    };

    public getAllUrl = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const urls = await this.urlService.getAllUrl(req.query);
            return res.status(200).json(urls);
        } catch (error) {
            next(error);
        }
    };

    public updateUrl = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const url = await this.urlService.updateUrl(req.params.id, req.body);
            return res.status(200).json(url);
        } catch (error) {
            next(error);
        }
    };

    public deleteUrl = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const url = await this.urlService.deleteUrl(req.params.id);
            return res.status(200).json(url);
        } catch (error) {
            next(error);
        }
    };

    public redirectUrl = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const url = await this.urlService.getOriginalUrlByUrl(req.params.url);
            return res.redirect(url);
        } catch (error) {
            return res.redirect(HOMEPAGE);
        }
    };
}

export default UrlController;
