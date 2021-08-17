const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * schema of a vendor requires its name, location, password
 * current address and if it is parked or not.
 * For the first time register, the user can enter name and password.
 * For the further update, user can change the location and the status
 * of parked.
 */
var VendorSchema = new Schema({
    name:{
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
    password:{
        type:String,
        required:true
    },
    curAddress:{
        type:String
    },
    parked:{
        type:Boolean,
        required:true,
        default:false
    }
});


module.exports = mongoose.model("Vendor",VendorSchema);