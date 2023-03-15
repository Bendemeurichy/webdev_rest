var express = require('express');
var router = express.Router();
const Vacature = require('../public/javascripts/mongomodels/vacatures');
const Recruiter = require('../public/javascripts/mongomodels/recruiter');
const Bedrijf = require('../public/javascripts/mongomodels/bedrijf');
const vacaturehandler= require('../public/javascripts/dbConnection/vacatureDbAccessor')

/* GET home page. */
router.get('/', async function(req, res, next) {
    try{
        const dbvacatures = await Vacature.find();
        res.render('vacatures', { vacatures: dbvacatures});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/new', async (req, res) => {
    const recruiters = await Recruiter.find();
    const bedrijven = await Bedrijf.find();
    res.render('vacatureForm', { recruiters, bedrijven });
});




module.exports = router;