import { Router } from 'express';
import UrlController from '@controllers/url.controller';
import { Routes } from '@interfaces/routes.interface';
import { urlValidator } from '@middlewares/url.validator';
import authMiddleware from '@middlewares/auth.middleware';
class UsersRoute implements Routes {
    public path = '/users';
    public router = Router();
    public urlController = new UrlController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .route('/')
            .get(authMiddleware, urlValidator, this.urlController.getAllUrl)
            .post(authMiddleware, urlValidator, this.urlController.createNewUrl);
        this.router
            .route('/:id')
            .get(authMiddleware, urlValidator, this.urlController.getUrlById)
            .patch(authMiddleware, urlValidator, this.urlController.updateUrl)
            .delete(authMiddleware, urlValidator, this.urlController.deleteUrl);
    }
}

export default UsersRoute;
