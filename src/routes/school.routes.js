const router = require("express").Router();
const schoolCtrl = require("../controllers/schools.controller");
const validate = require("../middlewares/validate");
const { listSchools } = require("../validators/validation");

router.get("/", validate(listSchools), schoolCtrl.listSchools);

module.exports = router;