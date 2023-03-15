var express = require('express');
var router = express.Router();
const Vacature = require('../public/javascripts/mongomodels/vacatures');
const Recruiter = require('../public/javascripts/mongomodels/recruiter');
const Bedrijf = require('../public/javascripts/mongomodels/bedrijf');
const vacaturehandler= require('/public/javascripts/dbConnection/vacatureDbAccessor')

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

app.get('/new', async (req, res) => {
    const recruiters = await Recruiter.find();
    const bedrijven = await Bedrijf.find();
    res.render('vacatureForm', { recruiters, bedrijven });
});

app.post('/vacatures', async (req, res) => {
    const { recruiter, bedrijf, beschrijving, eisen, salarisstart, salariseind, gepubliceerd, deadline } = req.body;
    try {
        vacaturehandler.addVacature(recruiter, bedrijf, beschrijving, eisen, salarisstart, salariseind, gepubliceerd, deadline);
    } catch (err){
        console.error("something went wrong while saving vacature,try again")
        alert("something went wrong while creating the vacature,try again")
        res.redirect('/new')
    }
    res.redirect('/');
});


module.exports = router;