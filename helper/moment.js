const moment = require('moment');


module.exports = function getDate() {
    return moment().format('MMM Do YYYY, h:mm:ss a');
}