const mongoose = require("mongoose");
const Bedrijf = require('./bedrijf');
const Werknemer = require("./werknemer");
const Schema = mongoose.Schema;

const beoordelingSchema =  new Schema({
    beoordeling_bedrijf: {
        type: Schema.Types.ObjectId,
        ref: 'Bedrijf',
        require: true
    },
    beoordeling_werknemer: {
        type: Schema.Types.ObjectId,
        ref: 'Werknemer',
        require: true
    },
    beoordeling_tekst: {
        type: String,
        require: true
    },
    beoordeling_score: {
        type: Number,
        min: 0,
        max: 5,
        require: true
    }
});

const Beoordeling = mongoose.model("Beoordeling", beoordelingSchema);
module.exports(Beoordeling);