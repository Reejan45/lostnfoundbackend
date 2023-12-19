const express = require("express");
const { checkAuthentication } = require("../middleware/auth");

const { index, create } = require("../controller/founditem");

const router = express.Router();

router.get("", index);

router.post("", checkAuthentication, create);

module.exports = router;
