const mongoose = require('mongoose')
const Recruiter = require('../mongomodels/recruiter')
const Vacature = require('../mongomodels/vacatures')
const Bedrijf = require('../mongomodels/bedrijf')
const Werkzoekende = require("../mongomodels/werkzoekende");
async function addRecruiter(a_naam,a_email,a_bedrijf,a_vacatures){
    let recruiter = new Recruiter({
        naam:a_naam,
        email:a_email,
        bedrijf:Bedrijf.findOne({naam:a_bedrijf}),
        vacatures:a_vacatures
    });
    await recruiter.save();
    console.log(`recruiter with email ${a_email} has been saved`)
}

async function removeRecruiter(a_email){
    await Recruiter.findOneAndDelete({email:a_email});
    console.log(`removed recruiter with email ${a_email}`);
}

async function addVacatureToRecruiter(a_id,a_recruitermail){
    try {
    let vacatuur = await Vacature.findOne({_id:a_id});
    if(!vacatuur){
        throw new Error(`vacature with id ${a_id} could not be found`);
    }

    let recruiter = await Recruiter.findOne({email:a_email});
    if(!recruiter){
        throw new Error('recruiter could not bet found')
    }

    recruiter.vacatures.push(vacatuur);
    await recruiter.save();
    console.log(`vacature added to recruiter with email ${recruiter}`)

} catch(err){
    console.error(err);
}}