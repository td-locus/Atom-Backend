class ApiError extends Error {
    constructor({ status = 500, message = '', data = {} }) {
        super()
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

module.exports = ApiError;