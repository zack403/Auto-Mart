module.exports = function errorResponse(status, error) {
    return {
        status : status,
        error : error
    }
}