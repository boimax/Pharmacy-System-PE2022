class BusinessError extends Error{};
class ClientError extends Error{};
class InputError extends Error{
    constructor(errors){
        super();
        this.errors = errors;
    }
};
class PermissionError extends Error{};
// class InputError extends Error{};

module.exports = {BusinessError,ClientError,InputError,PermissionError};