import {Response, Request, NextFunction} from 'express';

interface CustomError extends Error{
    statusCode? : number,
}

const errorHandler = (err: CustomError, req: Request, res : Response, next:NextFunction)=> {
    const statusCode: number = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
      });
}

export default errorHandler;