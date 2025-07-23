export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const response = {
        error: statusCode === 500 ? '伺服器內部錯誤' : err.message,
        ...(err.details && { details: err.details })
    };

    res.status(statusCode).json(response);
};