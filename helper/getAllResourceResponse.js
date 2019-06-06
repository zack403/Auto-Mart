module.exports = function getAllResourceResponse(resource) {
    return {
        status: 200,
        data: resource.length ? resource : 'No record found'
    }
}