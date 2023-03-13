const mongoose = require("mongoose");
const Vacature = require("./vacatures");
const Beoordeling = require("./beoordeling")
const Schema = mongoose.Schema;

const bedrijfSchema = new Schema({
    bedrijf_naam: {
        type: String,
        require: true
    },
    bedrijf_industrie: {
        type: String,
        require: true
    },
    bedrijf_beschrijving: {
        type: String,
        require: true
    },
    bedrijf_tot_aantal_werknemers: {
        type: String,
        min: 0,
        require: true
    },
    bedrijf_vacatures: {
        type: [Schema.Types.ObjectId],
        ref: 'Vacature',
        require: false
    },
    bedrijf_beoordelingen: {
        type: [Schema.Types.ObjectId],
        ref: 'Beoordeling',
        require: false
    },
    bedrijf_gem_score: {
        type: Number,
        require: false
    }
});

const Bedrijf = mongoose.model("Bedrijf", bedrijfSchema);
module.exports(Bedrijf);