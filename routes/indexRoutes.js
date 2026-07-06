const express = require("express");

const router = express.Router();

const view = require("../utils/view");

router.get("/", (req, res) => {

    view("index", res);

});

module.exports = router;