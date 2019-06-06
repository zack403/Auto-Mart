module.exports = (obj, email, message) => {
    return {
        status : 200,
        data : {
            id : obj.id,
            email : email,
            message : message,
            created_on : obj.created_on,
            manufacturer : obj.manufacturer,
            model : obj.model,
            price: obj.price,
            state: obj.state,
            status: obj.status
        }
    }
}