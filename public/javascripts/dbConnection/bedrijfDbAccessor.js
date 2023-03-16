const mongoose = require('mongoose');
const Bedrijf = require('../mongomodels/bedrijf');
const Beoordeling = require('../mongomodels/beoordeling')

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
    await Bedrijf.findOneAndeDelete({naam: a_naam});
    console.log(`removed bedrijf with name ${a_naam}`);
}

async function addBeoordeling(a_bedrijf, a_werknemer, a_tekst, a_score) {
    let b = Beoordeling.findOne({naam:a_bedrijf, werknemer:a_werknemer});
    if(!b) {
        if (a_score > 0 && a_score < 6) {
            b = new Beoordeling({
                bedrijf: a_bedrijf,
                werknemer: a_werknemer,
                a_tekst: a_tekst,
                score: a_score
            });

            let bedrijf = Bedrijf.findOne({naam: a_bedrijf});
            bedrijf.beoordelingen.push(b);
            bedrijf.update({score: ((bedrijf.gem_score + a_score) / 2)});
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