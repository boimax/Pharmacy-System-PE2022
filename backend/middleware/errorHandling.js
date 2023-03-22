const {ValidationError} = require("express-validator");
const { ClientError, BusinessError,InputError, PermissionError } = require("../error/Errors");
module.exports = {
    errorHandling: (err, req, res, next) => {
        let status = 500;
        let msg = "Internal server error";


        if( err instanceof InputError){
            status = 422;
            msg = err.errors;
        }else if (err instanceof BusinessError){
            status = 400;
            msg = err.message;
            console.info("Error from business side:",err);
        }else if(err instanceof PermissionError){
            status = 403;
            msg = err.message;
        }
        else{
            console.error("Unidentified error:",err);
            msg = err.message || err.error;
        }
        res.status(status).send({ status, error: msg });
    }
}
