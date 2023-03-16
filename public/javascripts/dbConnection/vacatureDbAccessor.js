const mongoose = require('mongoose');
const Vacature = require('../mongomodels/vacatures');
const Recruiter = require('../mongomodels/recruiter')
const Bedrijf = require('../mongomodels/bedrijf')
const Reactie = require('../mongomodels/reacties')

export async function addVacature(a_recruiter,a_bedrijf,a_beschrijving,a_eisen,a_salarisstart,a_salariseind,a_gepubliceerd,a_deadline){
    let vacatuur = new Vacature({
        recruiter: await Recruiter.findOne({email:a_recruiter}),
        bedrijf: await Bedrijf.findOne({naam:a_bedrijf}),
        beschrijving:a_beschrijving,
        eisen:a_eisen,
        salaris:{start:a_salarisstart,end:a_salariseind},
        publicatiedatum:a_gepubliceerd,
        deadline:a_deadline
    });
    await vacatuur.save();
    alert("new vacature has been added")
    console.log(`new vacature by bedrijf ${a_bedrijf} has been added`)
}

export async function removeVacature(a_id){
    await Vacature.findOneAndDelete({_id:a_id});
    console.log(`vacature by ${a_bedrijf} with beschrijving ${a_beschrijving} has been deleted`)
}



export async function addReactie(a_werkzoekende,a_tekst,a_vacature){
    let vacatuur = Vacature.findOne({_id:a_vacature});
    if(!vacatuur){
        throw new Error(``)
    }
    let reactie = new Reactie({
        werkzoekende:a_werkzoekende,
        tekst:a_tekst,
        vacature:Vacature.findOne({_id:a_vacature})
    });
    await reactie.save()

    vacatuur.reacties.push(reactie);
    await vacatuur.save()
    alert("reactie has been added");

    console.log(`reactie has been added`)
}
