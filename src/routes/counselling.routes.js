const router = require("express").Router();
const counsellingCtrl = require("../controllers/counselling.controller");
const validate = require("../middlewares/validate");
const { counsellingSchema } = require("../validators/validation");
const { adminAuth } = require("../middlewares/auth");

router.post("/", validate(counsellingSchema), counsellingCtrl.createCounsellingRequest);

router.get("/", adminAuth, counsellingCtrl.listCounsellingRequests);

module.exports = router;