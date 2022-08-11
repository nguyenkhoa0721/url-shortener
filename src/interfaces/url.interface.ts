export interface Url {
    _id: string;
    originalUrl: string;
    url: string;
    active: boolean;
    viewCount: number;
    updatedAt: Date;
    createdAt: Date;
}

export interface Urls {
    rows: Url[];
    totalItems: Number;
    totalPages: Number;
    currentPage: Number;
}
