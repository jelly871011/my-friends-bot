import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
    statusCode?: number;
    details?: unknown;
}

export const errorHandler = (
    err: ErrorWithStatus,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    const statusCode = err.statusCode || 500;
    const response: { error: string; details?: unknown } = {
        error: statusCode === 500 ? '伺服器內部錯誤' : err.message || 'An error occurred',
        ...(err.details ? { details: err.details } : {}),
    };

    res.status(statusCode).json(response);
};
