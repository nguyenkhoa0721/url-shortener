import { HttpException } from '@exceptions/HttpException';
import { Url, Urls } from '@/interfaces/url.interface';
import UrlModel from '@/models/url.model';
import { redisClient } from '@databases';
import _ from 'lodash';
import shortid from 'shortid';

class UserService {
    public async createNewUrl(originalUrl: string, url: string = ''): Promise<Url> {
        if (_.isEmpty(originalUrl)) {
            throw new HttpException(400, 'url-is-empty');
        }
        if (_.isEmpty(url)) {
            url = shortid.generate();
        }

        const existShortUrl = await UrlModel.findOne({ url });
        if (existShortUrl) {
            throw new HttpException(409, 'short-url-exist');
        }

        const newUrl = await UrlModel.create({ originalUrl, url, active: true });
        return newUrl;
    }

    public async getOriginalUrlByUrl(url: string): Promise<string> {
        if (_.isEmpty(url)) {
            throw new HttpException(400, 'url-is-empty');
        }

        let originalUrl: string = '';
        let urlId = 'url.' + url;

        const cacheResult = await redisClient.get(urlId);
        if (cacheResult) {
            originalUrl = cacheResult;
            UrlModel.findOneAndUpdate({ url }, { $inc: { viewCount: 1 } });
        } else {
            const existUrl = await UrlModel.findOneAndUpdate(
                { url },
                { $inc: { viewCount: 1 } },
                { new: true }
            );
            if (!existUrl || !existUrl.active) {
                throw new HttpException(404, 'url-not-found');
            }

            await redisClient.set(urlId, existUrl.originalUrl, {
                EX: 60 * 60 * 24 * 7,
                NX: true,
            });

            originalUrl = existUrl.originalUrl;
        }

        return originalUrl;
    }

    public async getUrlById(id: string): Promise<Url> {
        if (_.isEmpty(id)) {
            throw new HttpException(400, 'url-is-empty');
        }

        const existUrl = await UrlModel.findById(id);
        if (!existUrl) {
            throw new HttpException(404, 'url-not-found');
        }
        return existUrl;
    }

    public async getAllUrl(option: Object = {}): Promise<Urls> {
        let limit = parseInt(option['limit']) || 10;
        let page = parseInt(option['page']) || 1;
        let sort = option['sort'] || '-createdAt';

        let searchQuery = {};

        if (option['search']) {
            searchQuery = {
                $text: {
                    $search: option['search'],
                },
                score: { $meta: 'textScore' },
            };
            sort = { score: { $meta: 'textScore' } };
        }

        const urls = await UrlModel.find(searchQuery)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        const totalItems = await UrlModel.countDocuments(searchQuery);
        let res = {
            rows: urls,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
        };

        return res;
    }

    public async updateUrl(id: string, body: Url): Promise<Url> {
        if (_.isEmpty(id)) {
            throw new HttpException(400, 'id-is-empty');
        }
        const existUrl = await UrlModel.findById(id);
        if (!existUrl) {
            throw new HttpException(404, 'url-not-found');
        }
        if (body.url) {
            const existUrl = await UrlModel.findOne({ url: body.url });
            if (existUrl) {
                throw new HttpException(409, 'url-exist');
            }    
        }
        await redisClient.del('url.' + existUrl.url);
        const url = await UrlModel.findByIdAndUpdate(id, body, { new: true });
        return url;
    }

    public async deleteUrl(id: string): Promise<Url> {
        if (_.isEmpty(id)) {
            throw new HttpException(400, 'url-is-empty');
        }
        const existUrl = await UrlModel.findById(id);
        if (!existUrl) {
            throw new HttpException(404, 'url-not-found');
        }
        await redisClient.del('url.' + existUrl.url);

        const url = await UrlModel.findByIdAndRemove(id);
        return url;
    }
}

export default UserService;
