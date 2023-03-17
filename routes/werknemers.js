var express = require('express');
var router = express.Router();

const Werknemer = require('../public/javascripts/mongomodels/werknemer');
const {render} = require("express/lib/application");

/* GET bedrijven overview */
router.get('/', async function(req, res) {
    try {
        const dbWerknemers = await Werknemer.find();
        res.render('werknemers', {werknemers: dbWerknemers});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/add', async function(req, res) {
    res.render('addWerknemer')
});

module.exports = router;