var express = require('express');
var router = express.Router();
const Bedrijf = require('../public/javascripts/mongomodels/bedrijf');
const bedrijfControllor = require('../public/javascripts/dbConnection/bedrijfDbAccessor');
const {body} = require("express-validator");

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

router.get('/add', async (req, res) => {
    res.render('addBedrijf');
});

router.post('/add',
    body('naam').trim().isLength({min:1}).withMessage('Naam is verplicht').escape(),
    body('industrie').trim().isLength({min:1}).withMessage('Industrie is verplicht').isAlpha().withMessage('Enkel letters toegelaten').escape(),
    body('beschrijving').trim()
)

module.exports = router;