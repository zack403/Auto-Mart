const {Cars} = require('../models/car');

module.exports = async function(req, res, next) {
    const {status, max_price, min_price, state, manufacturer, body_type } = req.query;
    if(status && max_price && min_price) {
        const carByStatusAndPrice = await Cars.filter(car => car.status === status && 
            car.price <= max_price && car.price >= min_price);
        if(carByStatusAndPrice.length === 0) return res.status(404).send(`Car with the ${status} status and price range between ${min_price} and ${max_price} returns no result`);
        return res.status(200).send(carByStatusAndPrice);
    }
    else if (status && state) {
        const filteredState = state === "used" ? "used" : "new";
        const carByStatusAndState = await Cars.filter(car => car.status === status && 
            car.state === filteredState);
        if(carByStatusAndState.length === 0) return res.status(404).send(`Car with the ${status} status and state ${state} returns no result`);
        return res.status(200).send(carByStatusAndState);
    }
    else if (status && manufacturer) {
        const carByStatusAndMake = await Cars.filter(car => car.status === status && 
            car.manufacturer === manufacturer);
        if(carByStatusAndMake.length === 0) return res.status(404).send(`Car with the ${status} status and make ${manufacturer} returns no result`);
        return res.status(200).send(carByStatusAndMake);
    }
    else if(body_type) {
        const carByBodyType = await Cars.filter(car => car.body_type === body_type);
        if(carByBodyType.length === 0) return res.status(404).send(`Car with the ${body_type} body type returns no result`);
        return res.status(200).send(carByBodyType);
    }
    else if(status) {
        const carByStatus = await Cars.filter(car => car.status === status);
        if(carByStatus.length === 0) return res.status(404).send(`Car with the ${status} status returns no result`);
        return res.status(200).send(carByStatus);
    }
    next();
}