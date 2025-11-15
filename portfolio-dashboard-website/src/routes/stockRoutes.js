const stock = require('../controllers/stockApi');

const express = require("express");
const router = express.Router();

router.get('/findAllStocks',stock.findAllStocks);

module.exports = router;