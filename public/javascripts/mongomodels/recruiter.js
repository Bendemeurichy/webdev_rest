const mongoose = require("mongoose");
const Vacature = require("./vacatures");
const Bedrijf = require('./bedrijf')
const Schema = mongoose.Schema;

const recruiterSchema = new Schema({
    naam: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    bedrijf: {
        type: Schema.Types.ObjectId,
        ref: 'Bedrijf',
        required: true
    },
    vacatures: {
        type: [Schema.Types.ObjectId],
        ref: 'Vacature',
        require: false
    }
});

const Recruiter = mongoose.model("Recruiter",recruiterSchema);
module.exports=(Recruiter);