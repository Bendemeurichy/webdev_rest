const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactieSchema = new Schema({
    werkzoekende:{
        type:Schema.Types.ObjectId,
        ref:'Werkzoekende',
        required:true
    },
    tekst:{
        type:String,
        required:true
    },
    vacature:{
        type:Schema.Types.ObjectId,
        ref:'Vacature',
        required:true
    }
});

const Reactie = mongoose.model("Reactie",reactieSchema);
module.exports=(Reactie);