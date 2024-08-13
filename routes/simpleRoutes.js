const express = require('express');
const router  = express.Router();
const {basicRoute, chatRoute} = require('../controllers/simpleControllers');

router.route("/").get(basicRoute);
router.route("/chat").get(chatRoute);

module.exports = router;