const {Cars} = require('../models/car');
const errorResponse = require('../helper/errorResponse');

module.exports = async (req, res, next) => {
    let cars;
    let error;
    let notFound = 404;
    let ok = 200;
    const {status, max_price, min_price, state, manufacturer, body_type } = req.query;
    if(status && max_price && min_price) {
        cars = await Cars.filter(car => car.status === status && 
            car.price <= max_price && car.price >= min_price);
        if(cars.length === 0) return res.status(notFound).send(error = errorResponse(notFound, `Car with the ${status} status and price range between ${min_price} and ${max_price} returns no result`));
        return res.status(ok).send(cars);
    }
    else if (status && state) {
        const filteredState = state === "used" ? "used" : "new";
        cars = await Cars.filter(car => car.status === status && 
            car.state === filteredState);
        if(cars.length === 0) return res.status(notFound).send(error = errorResponse(notFound,`Car with the ${status} status and state ${state} returns no result`));
        return res.status(ok).send(cars);
    }
    else if (status && manufacturer) {
         cars = await Cars.filter(car => car.status === status && 
            car.manufacturer === manufacturer);
        if(cars.length === 0) return res.status(notFound).send(error = errorResponse(notFound, `Car with the ${status} status and make ${manufacturer} returns no result`));
        return res.status(ok).send(cars);
    }
    else if(body_type) {
        cars = await Cars.filter(car => car.body_type === body_type);
        if(cars.length === 0) return res.status(notFound).send(error = errorResponse(notFound,`Car with the ${body_type} body type returns no result`));
        return res.status(ok).send(cars);
    }
    else if(status) {
        cars = await Cars.filter(car => car.status === status);
        if(cars.length === 0) return res.status(notFound).send(error = errorResponse(notFound,`Car with the ${status} status returns no result`));
        return res.status(ok).send(cars);
    }
    next();
}