const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * schema of a order requires the customer order it
 * vendor make it, snacks that customer order, current making status,
 * customers' ratings and comment.
 * For placing an order, user, vendor and snacks are required
 */
var OrderSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    vendor:{
        type:Schema.Types.ObjectId,
        ref:'Vendor'
    },
    snacks:{
        type:Array,
        default:[]
    },
    status:{
        type:String,
        default:'outstanding'
    },
    ratings:{
        type:Number
    },
    comment:{
        type:String
    },
    prices:{
        type:Number
    },
    discount:{
        type:Boolean
    }
},{timestamps:true});


module.exports = mongoose.model("Order",OrderSchema);