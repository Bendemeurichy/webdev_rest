const express = require('express');
const router = express.Router();
const Vacature = require('../public/javascripts/mongomodels/vacatures');
const Recruiter = require('../public/javascripts/mongomodels/recruiter');
const Bedrijf = require('../public/javascripts/mongomodels/bedrijf');
const {addVacature}=require('../public/javascripts/dbConnection/vacatureDbAccessor')
const { body, validationResult } = require("express-validator");

/* GET home page. */
router.get('/', async function(req, res, next) {
    try{
        const dbvacatures = await Vacature.find().populate('bedrijf recruiter');

        res.render('vacatures', { vacatures: dbvacatures});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/vacatures/:id', async (req, res) => {
    try {
        const vacature = await Vacature.findById(req.params.id);
        const bedrijf = await Bedrijf.findById(vacature.bedrijf);
        const recruiter = await Recruiter.findById(vacature.recruiter);
        vacature.bedrijf = bedrijf.naam;
        vacature.recruiter = recruiter.naam;
        res.render('vacatureDetails', { vacature });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});



// Define a route for displaying the form
router.get('/new', async (req, res) => {
    const recruiters = await Recruiter.find();
    const bedrijven = await Bedrijf.find();
    res.render('newVacature', { recruiters, bedrijven });
});

// Define a route for processing the form submission
router.post('/new',
    body('beschrijving','can\'t be empty').trim().isLength({min:1}).withMessage('Beschrijving is verplicht').escape(),
    body('eisen','can\'t be empty').trim().isLength({min:1}).withMessage('eisen is verplicht').escape(),
    body('salarisstart','can\'t be empty').notEmpty().withMessage('Salaris start is verplicht').isNumeric().withMessage('Salaris start moet een nummer zijn').escape(),
    body('salariseind','can\'t be empty').notEmpty().withMessage('Salaris einde is verplicht').isNumeric().withMessage('Salaris einde moet een nummer zijn').escape(),
    body('gepubliceerd','can\'t be empty').notEmpty().isISO8601().toDate().withMessage('Gepubliceerd is verplicht').escape(),
    body('deadline','can\'t be empty').notEmpty().isISO8601().toDate().withMessage('Deadline is verplicht').escape()
    ,async (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(422).json({ errors: errorMessages });
        }else {
        const { recruiter, bedrijf, beschrijving, eisen, salarisstart, salariseind, gepubliceerd, deadline } = req.body;

        try {
            const newVacature = await addVacature(recruiter, bedrijf, beschrijving, eisen.split(','), salarisstart, salariseind, gepubliceerd, deadline);
            console.log('added succesfully')
            return res.redirect('/')

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while adding a new vacature.' });
        }
    }
});

module.exports = router;