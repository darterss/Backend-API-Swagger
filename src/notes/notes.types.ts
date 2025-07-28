export interface INote {
    title: string;
    body: string;
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IShareLinkResponse {
    id: string;
    token: string;
    expiresAt: Date;
    url: string;
}