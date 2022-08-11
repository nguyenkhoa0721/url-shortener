import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import UrlRouter from '@routes/v1/url.route';

class V1Route implements Routes {
    public path = '/api/v1';
    public router = Router();

    urlRouter = new UrlRouter();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(`${this.path}/url`, this.urlRouter.router);
    }
}

export default V1Route;
