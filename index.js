const express = require('express');

const app = express();


const server = app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})


module.exports = server;