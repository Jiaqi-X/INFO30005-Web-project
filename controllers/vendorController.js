const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
var Vendor = require("../models/vendorModel");

/**
 * user register a van
 * (POST) http://localhost:8080/vendor/register
 * @param {*} req 
 * @param {*} res 
 */
exports.vendorRegister = function(req, res){
    const{name, password} = req.body;
    Vendor.findOne({name: name}).then((vendor) => {
        if(vendor){
            res.status(409).json({error:"Vendor already registered!"})
        }else{
            const newVendor = new Vendor({
				name,
                password,
            })
            encryptPassword(res,newVendor)
        }
    })
}   

exports.vendorGetAll = function(req,res){
    Vendor.find().exec((err,vendor) =>{
        if (err){
            res.status(400).json({success:false,err:err})
        }else{
            res.status(200).json({success:true,vendor:vendor})
        }
    })
}

/**
 * encrypt the password of a account and store information
 * @param {*} res 
 * @param {*} newUser 
 */
function encryptPassword(res,newVendor) {
    bcryptjs.genSalt(16,(err, salt)=>{
                bcryptjs.hash(newVendor.password, salt, (err, hash) => {
                    if(err) throw err;
                    newVendor.password = hash;
                    newVendor.save().then((vendor) => {
                        res.json({
                            vendor:{
                                name:vendor.name,
                                password:vendor.password
                            }
                        })
                    })
                })
            })
}

/**
 * user update the information if an van with its location 
 * and is parked or not
 * (POST) http://localhost:8080/vendor/park/:vendorID
 * @param {*} req 
 * @param {*} res 
 */
exports.vendorParkPost = function(req, res){
    Vendor.findById(req.params.id).then(function (vendor) {
            if (!vendor) {
                res.status(409).json({ error: "Vendor not exist!" });
            } else {
                updateVendorState(req,res)
            }
        })
}

function updateVendorState(req,res) {
    Vendor.findByIdAndUpdate(
        req.params.id,
        {
            curAddress: req.body.curAddress,
            parked: req.body.parked,
            location: { type: "Point", coordinates: req.body.location }
        },
        { new: true },
        (err, updateVendor) => {
            if (err) {
                res.status(404).json({ success: false, err: err });
            } else {
                res.status(200).json({ success: true, updateVendor: updateVendor });
            }
        }
    );
}


exports.vendorGetFive = function(req,res){
    Vendor.find().exec((err,vendors) =>{
        if (err){
            res.status(400).json({success:false,err:err})
        }else{
            var mapDistance = []
            for (i=0;i<vendors.length;i++){
                if(vendors[i].location.coordinates!==null){
                var distance =  Math.sqrt(Math.hypot(
                    req.query.lat - vendors[i].location.coordinates[0],
                    req.query.lng - vendors[i].location.coordinates[1]
                ))
                if(Number.isFinite(distance)) {
                    mapDistance.push({
                        "id":vendors[i].id,
                        "name":vendors[i].name,
                        "curAddress":vendors[i].curAddress,
                        "distance":parseFloat(distance).toFixed(4),
                        "location":vendors[i].location.coordinates
                    })
                }
            }
            }
            mapDistance = mapDistance.sort(({distance:a},{distance: b})=>a-b).slice(0,5)
            res.status(200).json({success:true,vendors:mapDistance})
        }
    })
}


exports.VendorLoginPost = function(req,res){
    const{name,password} = req.body;
    Vendor.findOne({
        name:name,
    }).then((vendor)=>{
        if(!vendor){
            res.status(200).json({success: false, error:"Vendor not registered"})
        }else{
            bcryptjs.compare(password, vendor.password, (err,isMatch)=>{
                if(isMatch){
                    let token = jwt.sign({name:vendor.name},"jwt",{
                        expiresIn: 60*60*6
                    });
                    res.status(200).json({
                        success:true,
                        user:{
                            id:vendor.id,
                            name:vendor.name,
                        },token:token
                    })
                }else{
                    res.status(200).json({success:false, error:"Password doesn't match"})
                }
            })
        }
    })
}

exports.checkVendor= function(req,res){
    jwt.verify(req.body.token,"jwt",(err,decode)=>{
        if(err){
            res.send({'status':"10010"});
        }else{
            res.send({"status":"10000"})
        }
    })
}


Vendor.create