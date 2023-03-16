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
        const dbvacatures = await Vacature.find();
        for (const vacature of dbvacatures) {
            const bedrijf = await Bedrijf.findById(vacature.bedrijf);
            const recruiter = await Recruiter.findById(vacature.recruiter);
            vacature.bedrijf = bedrijf.naam;
            vacature.recruiter = recruiter.naam;
        }
        res.render('vacatures', { vacatures: dbvacatures});
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
    body('beschrijving').trim().isLength({min:1}).withMessage('Beschrijving is verplicht').isAlpha().withMessage("enkel letters en getallen zijn toegelaten").escape(),
    body('eisen').trim().isLength({min:1}).withMessage('eisen is verplicht').escape(),
    body('salarisstart').notEmpty().withMessage('Salaris start is verplicht').isNumeric().withMessage('Salaris start moet een nummer zijn').escape(),
    body('salariseind').notEmpty().withMessage('Salaris einde is verplicht').isNumeric().withMessage('Salaris einde moet een nummer zijn').escape(),
    body('gepubliceerd').notEmpty().isISO8601().toDate().withMessage('Gepubliceerd is verplicht').escape(),
    body('deadline').notEmpty().isISO8601().toDate().withMessage('Deadline is verplicht').escape()
    ,async (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }else {
        const { recruiter, bedrijf, beschrijving, eisen, salarisstart, salariseind, gepubliceerd, deadline } = req.body;

        try {
            const newVacature = await addVacature(recruiter, bedrijf, beschrijving, eisen.split(','), salarisstart, salariseind, gepubliceerd, deadline);
            res.redirect('/')
            return res.status(200).json({ message: 'New vacancy added successfully!', data: newVacature });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while adding a new vacancy.' });
        }
    }
});

module.exports = router;