var express = require('express');
var router = express.Router();

const Werknemer = require('../public/javascripts/mongomodels/werknemer');

/* GET bedrijven overview */
router.get('/', async function(req, res) {
    try {
        const dbWerknemers = await Werknemer.find();
        res.render('werknemers', {werknemerss: dbWerknemers});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});