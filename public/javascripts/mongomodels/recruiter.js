const mongoose = require("mongoose");
const Vacature = require("./vacatures");
const Schema = mongoose.Schema;

const recruiterSchema = new Schema({
    recruiter_naam: {
        type: String,
        required: true
    },
    recruiter_email: {
        type: String,
        required: true
    },
    recruiter_bedrijf: {
        type: String,
        required: true
    },
    recruiter_vacatures: {
        type: [Schema.Types.ObjectId],
        ref: 'Vacature',
        require: false
    }
});

const Recruiter = mongoose.model("Recruiter",recruiterSchema);
module.exports(Recruiter);