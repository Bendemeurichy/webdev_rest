const mongoose = require("mongoose");
const Bedrijf = require("./bedrijf")
const Schema = mongoose.Schema;

const werknemerSchema = new Schema({
    naam: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    bedrijf: {
        type: Schema.Types.ObjectId,
        ref: 'Bedrijf',
        require: true
    },
    functie: {
        type: String,
        require: true
    }
});

const Werknemer = mongoose.model("Werknemer", werknemerSchema);
module.exports=(Werknemer);