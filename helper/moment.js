const moment = require('moment');

module.exports = () => {
    return moment().format('MMM Do YYYY, h:mm:ss a');
}