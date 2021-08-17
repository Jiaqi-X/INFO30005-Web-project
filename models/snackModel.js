const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * schema of snack requires snackname, photo, price and description.
 */
var SnackSchema = new Schema({
    snackName:{
        type: String,
        required: true,
    },
    photo:{
        type:String,
        required:true
    },
    price:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    }
});


module.exports = mongoose.model("Snack",SnackSchema);