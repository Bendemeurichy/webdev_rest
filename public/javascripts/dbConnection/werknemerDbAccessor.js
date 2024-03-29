const mongoose = require('mongoose');
const Werknemer = require('../mongomodels/werknemer');
const Bedrijf = require('../mongomodels/bedrijf');

async function createWerknemer(a_naam, a_email, a_bedrijf, a_functie) {
    let valid=a_email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    let comp = await Bedrijf.findOne({naam:a_bedrijf});
    if(! valid){throw new Error("Invalid email")};

    let werknemer = new Werknemer({
        naam: a_naam,
        email: a_email,
        bedrijf: comp,
        functie: a_functie
    });
    comp.tot_aantal_werknemers = (comp.tot_aantal_werknemers + 1);
    await comp.save();
    await werknemer.save();
}

async function removeWerknemer(a_mail) {
    let nemer = await Werknemer.findOne({email:a_mail});
    let gever = await Bedrijf.findOne({_id:nemer.bedrijf});
    gever.tot_aantal_werknemers=gever.tot_aantal_werknemers-1;
    await gever.save();
    await nemer.delete();
    console.log(`werkzoekende with email ${a_email} has been deleted`);
}

module.exports.createWerknemer = createWerknemer;