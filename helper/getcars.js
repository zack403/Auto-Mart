const {Cars} = require('../models/car');



module.exports = async function(req, res, next) {
    const {status, max_price, min_price, state, manufacturer, body_type } = req.query;

    let cars = Cars;

    if(status && max_price && min_price) {
        cars = await cars.filter(car => car.status === status && 
            car.price <= max_price && car.price >= min_price);
        if(cars.length === 0) return res.status(404).send(`Car with the ${status} status and price range between ${min_price} and ${max_price} returns no result`);
        return res.status(200).send(cars);

    }
    else if (status && state) {
        const filteredState = state === "used" ? "used" : "new";
        cars = await cars.filter(car => car.status === status && 
            car.state === filteredState);
        if(cars.length === 0) return res.status(404).send(`Car with the ${status} status and state ${state} returns no result`);
        return res.status(200).send(cars);

    }
    else if (status && manufacturer) {
        cars = await cars.filter(car => car.status === status && 
            car.manufacturer === manufacturer);
        if(cars.length === 0) return res.status(404).send(`Car with the ${status} status and make ${manufacturer} returns no result`);
        return res.status(200).send(cars);

    }
    else if(body_type) {
        cars = cars.filter(car => car.body_type === body_type);
        if(cars.length === 0) return res.status(404).send(`Car with the ${body_type} body type returns no result`);
        return res.status(200).send(cars);

    }
    else if(status) {
        cars = cars.filter(car => car.status === status);
        if(cars.length === 0) return res.status(404).send(`Car with the ${status} status returns no result`);
        return res.status(200).send(cars);
    }

    next();
}