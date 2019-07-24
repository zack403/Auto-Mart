const {Cars} = require('../models/car');
const errorResponse = require('../helper/errorResponse');

module.exports = async (req, res, next) => {
    let car;
    let error;
    let notFound = 404;
    let ok = 200;

    const {rows: cars} = await Cars.findAll();
    const {status, max_price, min_price, state, manufacturer, body_type } = req.query;

    if(status && max_price && min_price && manufacturer && state) {
        car = await cars.filter(car => car.status.toLowerCase() === status.toLowerCase() && 
    car.price <= max_price && car.price >= min_price && car.state.toLowerCase() === state.toLowerCase() 
    && car.manufacturer.toLowerCase() === manufacturer.toLowerCase());
        if(car.length === 0) return res.status(notFound).send(error = errorResponse(notFound, "Search returns no result"));
        return res.status(ok).send(car);
    }
    else if(status && max_price && min_price) {
                car = await cars.filter(car => car.status.toLowerCase() === status.toLowerCase() && 
            car.price <= max_price && car.price >= min_price);
        if(car.length === 0) return res.status(notFound).send(error = errorResponse(notFound, `Car with the ${status} status and price range between ${min_price} and ${max_price} returns no result`));
        return res.status(ok).send(car);
    }
    else if (status && state) {
        const filteredState = state.toLowerCase() === "used" ? "used" : "new";
        car = await cars.filter(car => car.status.toLowerCase() === status.toLowerCase() && 
            car.state.toLowerCase() === filteredState);
        if(car.length === 0) return res.status(notFound).send(error = errorResponse(notFound,`Car with the ${status} status and state ${state} returns no result`));
        return res.status(ok).send(car);
    }
    else if (status && manufacturer) {
         car = await cars.filter(car => car.status.toLowerCase() === status.toLowerCase() && 
            car.manufacturer.toLowerCase() === manufacturer.toLowerCase());
        if(car.length === 0) return res.status(notFound).send(error = errorResponse(notFound, `Car with the ${status} status and make ${manufacturer} returns no result`));
        return res.status(ok).send(car);
    }
    else if(body_type) {
        car = await cars.filter(car => car.body_type.toLowerCase() === body_type.toLowerCase());
        if(car.length === 0) return res.status(notFound).send(error = errorResponse(notFound,`Car with the ${body_type} body type returns no result`));
        return res.status(ok).send(car);
    }
    else if(status) {
        car = await cars.filter(car => car.status.toLowerCase() === status.toLowerCase());
        if(car.length === 0) return res.status(notFound).send(error = errorResponse(notFound,`Car with the ${status} status returns no result`));
        return res.status(ok).send(car);
    }
    next();
}