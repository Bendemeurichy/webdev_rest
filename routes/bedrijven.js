var express = require('express');
var router = express.Router();
const Bedrijf = require('../public/javascripts/mongomodels/bedrijf');

/* GET bedrijven overview */
router.get('/', async function(req, res) {
    try {
        const dbBedrijven = await Bedrijf.find();
        res.render('bedrijven', {bedrijven: dbBedrijven});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;