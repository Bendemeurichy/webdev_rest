const mongoose = require('mongoose');
const Bedrijf = require('../mongomodels/bedrijf');
const Beoordeling = require('../mongomodels/beoordeling');
const Werknemer = require('../mongomodels/werknemer');

async function createBedrijf(a_naam, a_industrie, a_beschrijving) {
    let bedrijf = new Bedrijf({
        naam: a_naam,
        industrie: a_industrie,
        beschrijving: a_beschrijving,
        tot_aantal_werknemers: 0,
        gem_score: 0
    });
    await bedrijf.save();
    console.log(`bedrijf with name ${a_naam} has been saved`);
}

async function removeBedrijf(a_naam) {
    const bedrijf = await Bedrijf.findOne({naam: a_naam});
    await Werknemer.deleteMany({bedrijf:bedrijf._id});
    console.log('all werknemers were deleted');
    await Beoordeling.deleteMany({bedrijf:bedrijf._id});
    await Bedrijf.findOneAndRemove({naam:a_naam});
    console.log(`removed bedrijf with name ${a_naam}`);
}

async function addBeoordeling(a_bedrijf, a_werknemer, a_tekst, a_score) {
    let bed = await Bedrijf.findOne({naam:a_bedrijf});
    let nemer = await Werknemer.findOne({email:a_werknemer})
    let b = await Beoordeling.findOne({bedrijf:bed,werknemer:nemer});
    if(!b) {
        console.log('no duplicates found')
        if (a_score > 0 && a_score < 6) {
            console.log('adding beoordeling')
            b = new Beoordeling({
                bedrijf: a_bedrijf,
                werknemer: a_werknemer,
                a_tekst: a_tekst,
                score: a_score
            });

            let bedrijf = await Bedrijf.findOne({naam: a_bedrijf});
            bedrijf.beoordelingen.push(b);
            console.log("beoordeling toegevoegd aan bedrijf")
            //Calculating new avg score
            const b_beoordelingen = bedrijf.beoordelingen;
            var newScore = 0;
            b_beoordelingen.forEach(b => newScore+b);
            newScore = newScore / b_beoordelingen.length;

            bedrijf.score = newScore;
            await bedrijf.save();
            console.log(`beoordeling for bedrijf ${a_bedrijf.naam} form ${a_werknemer.email} has been added.`);
        }
    }
}

async function removeBeoordeling(a_bedrijf, a_werknemer) {
    // let toRemove = Beoordeling.findOne({naam:a_bedrijf, werknemer:a_werknemer});
    // Bedrijf.findOne({naam: a_bedrijf}).beoordelingen.pull(toRemove)
    await Beoordeling.findOneAndDelete({naam:a_bedrijf, werknemer:a_werknemer});
    console.log(`removed beoordeling for bedrijf ${a_bedrijf.naam} form ${a_werknemer.email}.`);
}

module.exports.createBedrijf = createBedrijf;
module.exports.removeBedrijf = removeBedrijf;
module.exports.addBeoordeling = addBeoordeling;