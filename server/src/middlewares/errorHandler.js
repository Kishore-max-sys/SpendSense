const errorHandler=(error,req,res,next) =>{
    console.error("ERROR:", error);
    res.status(error.statusCode || 500).json({
            success:false,
            message:error.message || "Internal server error"
    });
}

module.exports={errorHandler};