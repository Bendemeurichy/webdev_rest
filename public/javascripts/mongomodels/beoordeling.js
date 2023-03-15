const mongoose = require("mongoose");
const Bedrijf = require('./bedrijf');
const Werknemer = require("./werknemer");
const Schema = mongoose.Schema;

const beoordelingSchema =  new Schema({
    bedrijf: {
        type: Schema.Types.ObjectId,
        ref: 'Bedrijf',
        require: true,
        unique: true
    },
    werknemer: {
        type: Schema.Types.ObjectId,
        ref: 'Werknemer',
        require: true,
        unique:true
    },
    tekst: {
        type: String,
        require: true
    },
    score: {
        type: Number,
        min: 0,
        max: 5,
        require: true
    }
});

beoordelingSchema.pre('remove', { document: true }, async function (next) {
    try {
        // This will remove all references to the current document
        await mongoose.model('Bedrijf').updateMany({},{$pull:{beoordelingen:this._id}});

        // You can repeat this line for each model and field that references this document
        next();
    } catch (error) {
        next(error);
    }
});

const Beoordeling = mongoose.model("Beoordeling", beoordelingSchema);
module.exports=(Beoordeling);