const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * schema of a user which requires given and family name,
 * location,coordinates, email and password.
 * For the first time register, user are allowed to 
 * enter only names, password and email.
 */
var userSchema = new Schema({
    givenName:{
        type: String,
    },
    familyName:{
        type: String,
    },
    location:{
        type:{
            type:String,
            enum: ['Point'],
        },
        coordinates:{
            type:[Number]
        }
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        require:true
    },
});


module.exports = mongoose.model("User",userSchema);