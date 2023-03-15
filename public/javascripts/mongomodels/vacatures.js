const mongoose = require("mongoose");
const Werkzoekende = require('./werkzoekende')
const Recruiter = require('./recruiter')

const Schema = mongoose.Schema;

const vacatureSchema = new Schema({
    recruiter:{
        type:Schema.Types.ObjectId,
        ref:'Recruiter',
        required: true
    },
    bedrijf:{
        type:Schema.Types.ObjectId,
        ref:'Bedrijf',
        required: true
    },
    beschrijving:{
        type:String,
        required: true
    },
    eisen:{
        type:[String],
        required: true
    },
    salaris:{
        start:{type:Number,
            required: true,
            min: 0,
            validate: {
                validator: function(value) {
                    return value <= this.end;
                },
                message: 'Start salary must be less than or equal to end salary'
            }},
        end:{type:Number,required:true,min:0},
    },
    publicatiedatum:{
        type:Date,
        required:true
    },
    deadline:{
        type:Date,
        required:true
    },
    reacties:[{type:Schema.Types.ObjectId,ref:'Reactie'}]
});

vacatureSchema.pre('remove', { document: true }, async function (next) {
    try {
        // This will remove all references to the current document
        await mongoose.model('Werkzoekende').updateMany({}, { $pull: { gereageerdevacatures: this._id } });
        await mongoose.model('Bedrijf').updateMany({},{$pull:{vacatures:this._id}});
        await mongoose.model('Recruiter').updateMany({},{$pull:{vacatures:this._id}});
        // You can repeat this line for each model and field that references this document
        next();
    } catch (error) {
        next(error);
    }
});

const Vacature = mongoose.model("Vacature",vacatureSchema);
module.exports=(Vacature);