module.exports = function response(obj, email) {
    return {
        status : 200,
        data : {
            id : obj.id,
            email : email,
            created_on : obj.created_on,
            manufacturer : obj.manufacturer,
            model : obj.model,
            price: obj.price,
            state: obj.state,
            status: obj.status
        }
    }
}