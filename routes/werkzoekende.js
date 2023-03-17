var express = require('express');
var router = express.Router();
const Werkzoekende = require("../public/javascripts/mongomodels/werkzoekende");
const {createWerkzoekende} = require("../public/javascripts/dbConnection/werkzoekendeDbAccessor")
const {body, validationResult} = require("express-validator");

/* GET werkzoekende overview */
router.get('/', async function(req, res) {
    try {
        const dbWerkzoekende = await Werkzoekende.find();
        res.render('werkzoekenden', {werkzoekende: dbWerkzoekende});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/add' , async (req, res) => {
    res.render('addWerkzoekende');
});

router.post('/add',
    body('naam').trim().isLength({min:1}).withMessage('Naam is verplicht').escape(),
    body('email').trim().isLength({min:1}).withMessage('email is verplicht').escape(),
    body('competenties').trim().isLength({min:1}).withMessage('Competenties zijn verplicht').escape(),
    body('cv').trim().isLength({min:1}).withMessage('cv is verplicht').escape(),
    (req, res) => {
        const errors = validationResult(req);
        if (! errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.render('addWerkzoekende',{errors:errorMessages})
        } else {

            const a_naam = req.body.naam;
            const a_email = req.body.email;
            var a_competenties = req.body.competenties.split(',');
            const a_cv = req.body.cv;

            try {
                Werkzoekende.findOne({email:a_email}).then(async bedrijf=>{
                    if(bedrijf){
                        console.log("Werkzoekende bestaat error");
                        res.redirect('/werkzoekenden/add');
                        return;
                    }else {
                        await createWerkzoekende(a_naam, a_email, a_competenties, a_cv);
                        console.log("werkzoekende toegevoegd");
                        res.redirect('/werkzoekenden');
                        return;
                    }});
            } catch (err) {
                console.log("Unknown error has occurred");
                res.status(500).json({ message: 'An error occurred while adding a new werkzoekende.' });
                return
            }
        }
    }
);

module.exports = router;