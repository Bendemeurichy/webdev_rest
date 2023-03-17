var express = require('express');
var router = express.Router();
const {createWerknemer} = require("../public/javascripts/dbConnection/werknemerDbAccessor");
const {addBeoordeling} = require("../public/javascripts/dbConnection/bedrijfDbAccessor");

const Werknemer = require('../public/javascripts/mongomodels/werknemer');
const {render} = require("express/lib/application");
const {body, validationResult} = require("express-validator");
const Bedrijf = require('../public/javascripts/mongomodels/bedrijf');
const Beoordeling = require('../public/javascripts/mongomodels/beoordeling');

/* GET bedrijven overview */
router.get('/', async function(req, res) {
    try {
        const dbWerknemers = await Werknemer.find().populate('bedrijf');
        res.render('werknemers', {werknemers: dbWerknemers});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/add', async function(req, res) {
    const bedrijven = await Bedrijf.find();
    res.render('addWerknemer',{bedrijven:bedrijven});
});

router.post('/add',
    body('naam').trim().isLength({min:1}).withMessage('Naam is verplicht').escape(),
    body('email').trim().isLength({min:1}).withMessage('email is verplicht').escape(),
    body('functie').trim().isLength({min:1}).withMessage('cv is verplicht').escape(),
    (req, res) => {
        const errors = validationResult(req);
        if (! errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.render('addWerknemer',{errors:errorMessages})
        } else {
            const a_naam = req.body.naam;
            const a_email = req.body.email;
            const a_bedrijf = req.body.bedrijf;
            const a_functie = req.body.functie;
            try{
                Werknemer.findOne({email: a_email}).then(async wn => {
                    if (wn) {
                        console.log("Werknemer bestaat error");
                        res.redirect('/werknemers/add');
                        return;
                    } else {
                        Bedrijf.findOne({naam: a_bedrijf}).then(async bd => {
                            if (!bd) {
                                console.log(`Bedrijf met naam ${a_bedrijf} bestaat niet`);
                                res.redirect('/werknemers/add');
                                return;
                            } else {
                                await createWerknemer(a_naam, a_email, a_bedrijf, a_functie).catch(err=>{throw err});
                                console.log("werknemer toegevoegd");
                                res.redirect('/werknemers');
                                return;
                            }
                        });
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

router.get('/review/:email/:bedrijf', async (req, res) => {
    try {
        const a_email = req.params.email;
        const a_bedrijf = req.params.bedrijf;
        const c_werknemer = await Werknemer.findOne({email:a_email});
        const c_bedrijf = await Bedrijf.findOne({naam:a_bedrijf});
        Beoordeling.findOne({bedrijf: c_bedrijf._id, werknemer: c_werknemer._id}).then(beoord => {
            if (beoord) {
                console.log('gebruiker heeft al een beoordeling geplaatst');
                res.redirect('/werknemers');
                return
            } else {
                res.render('addBeoordeling');
            }
        })
    } catch (err) {

    }
})

router.post('/review/:email/:bedrijf',
    body('beoordeling').trim().isLength({min:1}).withMessage('Naam is verplicht').escape(),
    body('score').trim().isLength({min:1}).withMessage('email is verplicht').escape(),
    async (req, res) => {
        const errors = validationResult(req);
        if (! errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.render('addBeoordeling',{errors:errorMessages})
        } else {
            const a_beoordeling = req.body.beoordeling;
            const a_score = req.body.score
            const a_email = req.params.email;
            const a_bedrijf = req.params.bedrijf;
            try {
                const c_werknemer = await Werknemer.findOne({email: a_email});
                const c_bedrijf = await Bedrijf.findOne({naam: a_bedrijf});
                await addBeoordeling(c_bedrijf.naam, c_werknemer.email, a_beoordeling, a_score);
                console.log("beoordeling toegevoegd");
                res.redirect('/werknemers');
                return;
            } catch (err) {
                console.log("Unknown error has occurred");
                res.status(500).json({ message: 'An error occurred while adding a new beoordeling.' });
                return
            }
        }
    }
    );

module.exports = router;