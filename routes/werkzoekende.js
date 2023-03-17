var express = require('express');
var router = express.Router();
const Werkzoekende = require("../public/javascripts/mongomodels/werkzoekende");
const {createWerkzoekende} = require("../public/javascripts/dbConnection/werkzoekendeDbAccessor");
const {updateWerkzoekende} = require("../public/javascripts/dbConnection/werkzoekendeDbAccessor");
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
    let errors =[]
    if(res.statusCode===445){
        errors = ["invalid email"]
        res.render('addWerkzoekende',{errors:errors})
    } else {
        res.render('addWerkzoekende', );
    }
});

router.get('/edit/:email', async (req, res) => {
    const a_email = req.params.email;
    console.log(a_email)
    const a_werkzoekende = await Werkzoekende.findOne({email: a_email});
    const a_c_string = a_werkzoekende.competenties.join(',');
    res.render('editWerkzoekende', {email: a_werkzoekende.email, naam: a_werkzoekende.naam, cv: a_werkzoekende.cv, c_string: a_c_string});
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
            const a_competenties = req.body.competenties.split(',');
            const a_cv = req.body.cv;

            try {
                Werkzoekende.findOne({email:a_email}).then(async bedrijf=>{
                    if(bedrijf){
                        console.log("Werkzoekende bestaat error");
                        res.redirect('/werkzoekenden/add');
                        return;
                    }else {
                        let valid=a_email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
                        if(! valid){
                            console.error('invalid email')
                            res.redirect(445,'werkzoekenden/add')
                        } else {

                            await createWerkzoekende(a_naam, a_email, a_competenties, a_cv).catch(err=>{throw err})
                            console.log("werkzoekende toegevoegd");
                            res.redirect('/werkzoekenden');
                            return;}
                    }});
            } catch (err) {
                console.log("Unknown error has occurred");
                res.status(500).json({ message: 'An error occurred while adding a new werkzoekende.' });
                return
            }
        }
    }
);

router.patch('/edit/:email',
        body('Naam').trim().isLength({min:1}).withMessage('Naam is verplicht').escape(),
        body('Email').trim().isLength({min:1}).withMessage('email is verplicht').escape(),
        body('Competenties').trim().isLength({min:1}).withMessage('Competenties zijn verplicht').escape(),
        body('Cv').trim().isLength({min:1}).withMessage('cv is verplicht').escape(),
        async (req, res) => {
            const oldEmail = req.params.email;
            const old_werkzoekende = await Werkzoekende.findOne({email: oldEmail});
            const a_c_string = old_werkzoekende.competenties.join(',');
            const errors = validationResult(req);
            if (! errors.isEmpty()) {
                const errorMessages = errors.array().map(error => error.msg);
                console.log('Validation error');
                return res.render('editWerkzoekende',{email: old_werkzoekende.email, naam: old_werkzoekende.naam, cv: old_werkzoekende.cv, c_string: a_c_string})
            } else {
                const a_naam = req.body.naam;
                const a_email = req.body.email;
                const a_competenties = req.body.competenties.split(',');
                const a_cv = req.body.cv;

                try {
                    let valid=a_email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
                    if(! valid){
                        console.error('invalid email')
                        res.redirect(445,'werkzoekenden')
                    } else {
                        await updateWerkzoekende(a_naam, a_email, a_competenties, a_cv, oldEmail).catch(err=>{throw err})
                        console.log("werkzoekende aangepast");
                        res.redirect('/werkzoekenden');
                        return;
                    }

                } catch (err) {
                    console.log("Unknown error has occurred");
                    res.status(500).json({ message: 'An error occurred while editing a werkzoekende.' });
                    return
                }
            }
});

module.exports = router;