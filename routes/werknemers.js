var express = require('express');
var router = express.Router();

const Werknemer = require('../public/javascripts/mongomodels/werknemer');
const {render} = require("express/lib/application");
const {body, validationResult} = require("express-validator");

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

router.post('/add',
    body('naam').trim().isLength({min:1}).withMessage('Naam is verplicht').escape(),
    body('email').trim().isLength({min:1}).withMessage('email is verplicht').escape(),
    body('bedrijf').trim().isLength({min:1}).withMessage('Competenties zijn verplicht').escape(),
    body('functie').trim().isLength({min:1}).withMessage('cv is verplicht').escape(),
    (req, res) => {
        const errors = validationResult(req);
        if (! errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.render('addWerkzoekende',{errors:errorMessages})
        } else {
            const a_naam = req.body.naam;
            const a_email = req.body.email;
            const a_bedrijf = req.body.bedrijf;
            const a_cv = req.body.functie;
            try{
                Werknemer.findOne({email: a_email}).then(async wn => {
                    if (wn) {
                        console.log("Werknemer bestaat error");
                        res.redirect('/werknemers/add');
                        return;
                    } else {
                        
                    }
                });
            } catch (err) {
                console.log("Unknown error has occurred");
                res.status(500).json({ message: 'An error occurred while adding a new werknemer.' });
                return
            }
        }
    }
);

module.exports = router;