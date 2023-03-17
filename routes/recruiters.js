var express = require('express');
var router = express.Router();
const Bedrijf = require('../public/javascripts/mongomodels/bedrijf');
const Recruiter = require('../public/javascripts/mongomodels/recruiter');
const {removeRecruiter, addRecruiter} = require('../public/javascripts/dbConnection/recruiterDbAccessor');
const {body, validationResult} = require("express-validator");
const mongoose = require("mongoose");

/* GET bedrijven overview */
router.get('/', async function(req, res) {
    try {
        const dbRecruiters = await Recruiter.find().populate('bedrijf');
        res.render('recruiters', {recruiters: dbRecruiters});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/add', async (req, res) => {
    const bedrijven = await Bedrijf.find();
    res.render('addRecruiter',{bedrijven});
});

router.get('/overview/:recruiter', async(req, res) => {
    const recruitermail = req.params.recruiter;
    console.log(recruitermail);
    try {
        const requested = await Bedrijf.findOne({naam: bedrijfNaam});
        const reviews = await Beoordeling.find({bedrijf: requested._id});
        res.render('bedrijfOverview', {bedrijf: requested, beoordelingen: reviews});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/add',
    body('naam').trim().isLength({min:1}).withMessage('Naam is verplicht').escape(),
    body('email').trim().isLength({min:1}).withMessage('Industrie is verplicht').escape(),
    (req, res) => {
        const errors = validationResult(req);
        if (! errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.render('addRecruiter',{errors:errorMessages})
        } else {

            const a_naam = req.body.naam;
            const a_email = req.body.email;
            const a_bedrijf = req.body.bedrijf;
            try {
                Recruiter.findOne({email:a_email}).then(async bedrijf=>{
                    if(bedrijf){
                        console.log("recruiter bestaat error");
                        res.redirect('/recruiters/add');
                        return;
                    }else {
                        await addRecruiter(a_naam, a_email, a_bedrijf);
                        console.log("recruiter toegevoegd");
                        res.redirect('/recruiters');
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
    const email = req.params.id;
    console.log(email+ 'delete called')
    try{
        await removeRecruiter(email)
        return res.status(200).json({message:'deleted succesfully'});
    }catch(err){
        console.log("Unknown error has occurred");
        res.status(500).json({ message: 'An error occurred while removing a bedrijf.' });
        return;
    }

})
module.exports = router;