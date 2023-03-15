var express = require('express');
var router = express.Router();
const Vacature = require('../public/javascripts/mongomodels/vacatures');
const Recruiter = require('../public/javascripts/mongomodels/recruiter');
const Bedrijf = require('../public/javascripts/mongomodels/bedrijf');

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



// Define a route for displaying the form
router.get('/vacatures/new', async (req, res) => {
    const recruiters = await Recruiter.find();
    const bedrijven = await Bedrijf.find();
    res.render('vacatureForm', { recruiters, bedrijven });
});

// Define a route for processing the form submission
router.post('/vacatures', async (req, res) => {
    const { recruiter, bedrijf, beschrijving, eisen, salarisstart, salariseind, gepubliceerd, deadline } = req.body;

    const vacature = new Vacature({
        recruiter: await Recruiter.findOne({ _id: recruiter }),
        bedrijf: await Bedrijf.findOne({ _id: bedrijf }),
        beschrijving,
        eisen,
        salaris: { start: salarisstart, end: salariseind },
        publicatiedatum: gepubliceerd,
        deadline
    });

    await vacature.save();
    console.log(`New vacature by bedrijf ${bedrijf} has been added`);
    res.redirect('/vacatures');
});

module.exports = router;