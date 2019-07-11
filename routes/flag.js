const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {Flags, validate} = require('../models/flag');
const {Cars} = require('../models/car');
const errorResponse = require('../helper/errorResponse');
const resourceResponse = require('../helper/getAllResourceResponse');



router.get("/", auth, async (req, res) => {
    const {rows} = await Flags.findAll();
    const resource = resourceResponse(rows);
    return res.status(200).send(resource);
})

router.get("/:id", auth, async (req, res) => {
    const {rows: flag} = await Flags.findById(parseInt(req.params.id));
    if(!flag[0]) return res.status(404).send(errorMessage = errorResponse(404, "Reported Ad not found"));
    const {id, car_id, reason, description, owner} = flag[0];
    res.status(200).send({
        id,
        car_id,
        reason, 
        description,
        owner
    });
})

router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if (error){
        const clientError = errorResponse(400, error.details[0].message);
        return res.status(400).send(clientError);
    }   
    //get the id of the logged in user
    const {id} = req.user;
    const {car_id, reason, description} = req.body;
    // find the car to be reported
    const {rows: car} = await Cars.findById(parseInt(car_id));
    // bounce the user if car does not exist
    if(!car[0]) return res.status(404).send("This ad does not exist");
    //create the flagged ad here
    const {rows: created} = await Flags.save(id, car_id, reason, description);
    if (created[0]) {
        const {id, car_id, reason, description} = created[0];
        res.status(200).send({
            id,
            message: `Ad ${car[0].manufacturer} reported successfully`,
            car_id,
            reason,
            description
        })
    }
});

module.exports = router;