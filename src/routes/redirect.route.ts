import { Router } from 'express';
import UrlController from '@controllers/url.controller';
import { Routes } from '@interfaces/routes.interface';

class UsersRoute implements Routes {
    public path = '/';
    public router = Router();
    public urlController = new UrlController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.route('/:url').get(this.urlController.redirectUrl);
    }
}

export default UsersRoute;
