const express = require('express');
const router = express.Router();





router.post('/',  async (req, res) => {
 return res.status(400).send();
});

module.exports = router;