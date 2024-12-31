const express = require("express")

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
})

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/loging', (req, res) => {
    res.render('loging');
});

router.get('/patients', (req, res) => {
    res.render('patients');
});

router.get('/appointment', (req, res) => {
    res.render('appointment');
});


module.exports = router;