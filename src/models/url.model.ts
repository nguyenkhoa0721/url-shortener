import { model, Schema, Document } from 'mongoose';
import { Url } from '@/interfaces/url.interface';

const urlSchema: Schema = new Schema(
    {
        originalUrl: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
            unique: true,
        },
        active: {
            type: Boolean,
            default: true,
        },
        viewCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);
urlSchema.index(
    { url: 'text', shortUrl: 'text' },
    { name: 'searchIndex', weights: { url: 1, shortUrl: 1 } }
);
const urlModel = model<Url & Document>('Url', urlSchema);

export default urlModel;
