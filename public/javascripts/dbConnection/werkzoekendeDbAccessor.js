const mongoose = require('mongoose');
const Werkzoekende = require('../mongomodels/werkzoekende');
const Vacature = require('../mongomodels/vacatures')
async function createWerkzoekende(a_naam,a_email,a_competenties,a_cv){
    let zoeker = new Werkzoekende({
        naam:a_naam,
        email:a_email,
        competenties:a_competenties,
        cv:a_cv
    });

    await zoeker.save();
    console.log(`new werkzoekende with email ${a_email} has been saved`);
}

async function updateWerkzoekende(a_naam, a_email, a_competenties, a_cv, a_old_email) {
    console.log("update called")
    const zoeker = await Werkzoekende.findOne({email: a_old_email});
    zoeker.naam = a_naam;
    zoeker.email = a_email;
    zoeker.competenties = a_competenties;
    zoeker.cv = a_cv;
    await zoeker.save();
    console.log('Werkzoekende updated');
}

async function removeWerkzoekende(a_email){
    await Werkzoekende.findOneAndDelete({email:a_email});
    console.log(`werkzoekende with email ${a_email} has been deleted`);
}

async function addVacaturetoWerkzoekende(a_email,a_id){
    try {
        let zoeker = await Werkzoekende.findOne({email: a_email});
        if(!zoeker){
            throw new Error(`werkzoekende with email ${a_email} could not be found`);
        }

        let vacature = await Vacature.findOne({_id:a_id});
        if(!vacature){
            throw new Error('vacature could not bet found')
        }

        zoeker.gereageerdevacatures.push(vacature);
        await zoeker.save();
        console.log(`vacature added to werkzoekende with email ${a_email}`)

    } catch(err){
        console.error(err);
    }
}


module.exports.createWerkzoekende = createWerkzoekende;
module.exports.updateWerkzoekende = updateWerkzoekende;
module.exports.removeWerkzoekende = removeWerkzoekende;