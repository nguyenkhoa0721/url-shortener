import * as redis from 'redis';

import {
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    DB_PASS,
    DB_USERNAME,
    REDIS_PASSWORD,
    REDIS_HOST,
    REDIS_PORT,
} from '@config/index';

export const dbConnection = {
    url: `mongodb://${DB_USERNAME}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
};

export const redisClient = redis.createClient({
    url: `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
});
