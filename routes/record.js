var express = require("express");
const RecordController = require("../controllers/RecordController");

var router = express.Router();

router.post("/", RecordController.create_record);

module.exports = router;
