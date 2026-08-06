class AppError extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
        this.name="appError";
        Error.captureStackTrace(this,this.constructor);
    }
};

module.exports=AppError;