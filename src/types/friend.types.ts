import { Request } from 'express';

interface FriendRequestParams {
    name: string;
}

type FriendField = 'interests' | 'catchphrases';

interface UpdateArrayFieldRequest extends Request {
    body: {
        [key: string]: string[] | undefined;
    } & Record<string, unknown>;
    params: {
        name: string;
    };
}

export type { FriendRequestParams, FriendField, UpdateArrayFieldRequest };
