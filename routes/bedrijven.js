var express = require('express');
var router = express.Router();
const Bedrijf = require('../public/javascripts/mongomodels/bedrijf');
const Beoordeling = require('../public/javascripts/mongomodels/beoordeling');
const {removeBedrijf, createBedrijf} = require('../public/javascripts/dbConnection/bedrijfDbAccessor');
const {body, validationResult} = require("express-validator");

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

router.get('/overview/:bedrijf', async(req, res) => {
    const bedrijfNaam = req.params.bedrijf;
    console.log(bedrijfNaam);
    try {
        const requested = await Bedrijf.findOne({naam: bedrijfNaam}).populate('beoordelingen');
        res.render('bedrijfOverview', {bedrijf: requested});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/add',
    body('naam').trim().isLength({min:1}).withMessage('Naam is verplicht').escape(),
    body('industrie').trim().isLength({min:1}).withMessage('Industrie is verplicht').escape(),
    body('beschrijving').trim().isLength({min:1}).withMessage('Beschrijving is verplicht').escape()
    ,
        (req, res) => {
    const errors = validationResult(req);
    if (! errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.render('addBedrijf',{errors:errorMessages})
    } else {

        const a_naam = req.body.naam;
        const a_industrie = req.body.industrie;
        const a_beschrijving = req.body.beschrijving;
        try {
            Bedrijf.findOne({naam:a_naam}).then(async bedrijf=>{
                if(bedrijf){
                console.log("Bedrijf bestaat error");
                res.redirect('/bedrijven/add');
                return;
            }else {
                await createBedrijf(a_naam, a_industrie, a_beschrijving);
                console.log("bedrijf toegevoegd");
                res.redirect('/bedrijven');
                return;
                }});
        } catch (err) {
            console.log("Unknown error has occurred");
            res.status(500).json({ message: 'An error occurred while adding a new bedrijf.' });
            return
        }
    }
});

router.delete('/delete/:id',async(req,res)=>{
    const bedrijfid = req.params.id;
    console.log(bedrijfid+ 'delete called')
    try{
        await removeBedrijf(bedrijfid)
        return res.status(200).json({message:'deleted succesfully'});
    }catch(err){
        console.log("Unknown error has occurred");
        res.status(500).json({ message: 'An error occurred while removing a bedrijf.' });
        return;
    }

})
module.exports = router;