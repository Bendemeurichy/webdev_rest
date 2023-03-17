const mongoose = require('mongoose');
const Werknemer = require('../mongomodels/werknemer');
const Bedrijf = require('../mongomodels/bedrijf');

async function createWerknemer(a_naam, a_email, a_bedrijf, a_functie) {
    let valid=a_email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    let comp = Bedrijf.findOne({naam:a_naam})
    if(! valid){throw new Error("Invalid email")};

    let werknemer = new Werknemer({
        werknemer_naam: a_naam,
        werknemer_email: a_email,
        werknemer_bedrijf: comp,
        werknemer_functie: a_functie
    });
    await comp.update({tot_aantal_werknemers:comp.tot_aantal_werknemers+1});
    await comp.save();
    await werknemer.save();
}

async function removeWerknemer(a_mail) {
    let nemer = Werknemer.findOne({email:a_mail});
    let gever = Bedrijf.findOne({_id:nemer.bedrijf});
    gever.update({tot_aantal_werknemers:gever.tot_aantal_werknemers-1});
    await gever.save();
    await nemer.delete();
    console.log(`werkzoekende with email ${a_email} has been deleted`);
}

module.exports.createWerknemer = createWerknemer;