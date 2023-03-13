const mongoose = require('mongoose');
const Werknemer = require('../mongomodels/werknemer');

async function createWerknemer(a_naam, a_email, a_bedrijf, a_functie) {
    let valid=email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    if(! valid){throw new Error("Invalid email")};

    let werknemer = new Werknemer({
        werknemer_naam: a_naam,
        werknemer_email: a_naam,
        werknemer_bedrijf: a_bedrijf,
        werknemer_functie: a_functie
    });

    await werknemer.save();
}

async function removeWerknemer()//TODO