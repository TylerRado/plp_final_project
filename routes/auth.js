const express = require("express")
const authController = require("../controllers/auth");

const router = express.Router();

router.post('/register', authController.register);

router.post('/loging', authController.loging);

router.post('/patients', authController.register);

router.post('/appointment', authController.register);
   

module.exports = router;