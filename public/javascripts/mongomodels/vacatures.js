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
        required:true
    },
    beschrijving:{
        type:String,
        required:true
    },
    eisen:[String],
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
        required:true
    },
    publicationdate:{
        type:Date,
        required:true
    },
    deadline:{
        type:Date,
        required:true
    },
    reacties:[{type:Schema.Types.ObjectId,ref:'Reactie'}]
});

const Vacature = mongoose.model("Vacature",vacatureSchema);
module.exports(Vacature)