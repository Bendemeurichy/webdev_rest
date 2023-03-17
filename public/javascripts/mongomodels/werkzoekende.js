const mongoose = require("mongoose");
const Vacature = require('./vacatures')
const Schema = mongoose.Schema;

const werkzoekendeSchema = new Schema({
    naam: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    competenties: {
        type: [String],
        required: true
    },
    cv: {
        type: String,
        required: true
    },
    gereageerdevacatures: {
        type: Schema.Types.ObjectId,
        ref: 'Vacature',
        required:false
    }
});



const Werkzoekende = mongoose.model("Werkzoekende",werkzoekendeSchema);
module.exports = (Werkzoekende);