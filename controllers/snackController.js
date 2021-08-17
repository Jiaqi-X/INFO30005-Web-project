var Snack = require("../models/snackModel");


/**
 * get the snacks that are in the menu
 * (GET) http://localhost:8080/snack/menu
 * @param {*} req 
 * @param {*} res 
 */
exports.getSnackMenu = function(req,res){
    Snack.find().exec((err,snacks) =>{
        if (err){
            res.status(400).json({success:false,err:err})
        }else{
            res.status(200).json({success:true,snacks:snacks})
        }
    })
}

/**
 * get the details of an specific snack
 * (GET) http://localhost:8080/snack/menu/:snackID
 * @param {*} req 
 * @param {*} res 
 */
exports.getSnackDetail = function(req,res){
    Snack.findById(req.params.id,function(err,snack){
        if(err){
            res.status(400).json({success:false,err:err})
        }else{
            res.status(200).json({success:true,snack:snack})
        }
    })
}

Snack.create