export class AppError extends Error {
    statusCode: number;
    details: any[];

    constructor(message: string | undefined, statusCode = 500, details: any[] = []) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message = '資料驗證失敗', details = []) {
        super(message, 400, details);
    }
}

export class NotFoundError extends AppError {
    constructor(resource = '資源') {
        super(`${resource} 不存在`, 404);
    }
}
