const mongoose = require("mongoose");
const Vacature = require("./vacatures");
const Beoordeling = require("./beoordeling")
const Schema = mongoose.Schema;

const bedrijfSchema = new Schema({
    naam: {
        type: String,
        require: true,
        unique: true
    },
    industrie: {
        type: String,
        require: true
    },
    beschrijving: {
        type: String,
        require: true
    },
    tot_aantal_werknemers: {
        type: Number,
        min: 0,
        require: true
    },
    vacatures: {
        type: [Schema.Types.ObjectId],
        ref: 'Vacature',
        require: false
    },
    beoordelingen: {
        type: [Schema.Types.ObjectId],
        ref: 'Beoordeling',
        require: false
    },
    gem_score: {
        type: Number,
        require: false
    }
});



const Bedrijf = mongoose.model("Bedrijf", bedrijfSchema);
module.exports=(Bedrijf);