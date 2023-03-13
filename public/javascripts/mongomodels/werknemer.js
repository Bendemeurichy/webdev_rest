const mongoose = require("mongoose");
const Bedrijf = require("public/javascripts/mongomodels/bedrijf")
const Schema = mongoose.Schema;

const werknemerSchema = new Schema({
    werknemer_naam: {
        type: String,
        require: true
    },
    werknemer_email: {
        type: String,
        require: true
    },
    werknemer_bedrijf: {
        type: Schema.Types.ObjectId,
        ref: 'Bedrijf',
        require: true
    },
    werknemer_functie: {
        type: String,
        require: true
    }
});

const Werknemer = mongoose.model("Werknemer", werknemerSchema);
module.exports(Werknemer);