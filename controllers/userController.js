const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
var User = require("../models/userModel");


/**
 * user registers a new account
 * (POST) http://localhost:8080/user/register
 */
exports.userRegister = function(req,res){
    const{givenName, familyName, email, password} = req.body;
    User.findOne({email: email}). then((user) => {
        if(user){
            res.status(200).json({success:false,error: "Email has been registered!"})
        }else{
            const newUser = new User({
                givenName,
                familyName,
                email,
                password,
            })
            encryptePassword(res,newUser)            
        }
    })
}

/**
 * encrypt the password of a account and store information
 * @param {*} res 
 * @param {*} newUser 
 */
function encryptePassword(res,newUser) {
    bcryptjs.genSalt(16,(err,salt)=>{
        bcryptjs.hash(newUser.password,salt, (err,hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save().then((user) => {
                res.json({success:true,
                    user:{
                        givenName:user.givenName,
                        familyName:user.familyName,
                        email:user.email,
                        password:user.password
                    }
                })
            })
        })
    })
}
exports.UserLoginPost = function(req,res){
    const{email,password} = req.body;
    User.findOne({
        email:email,
    }).then((user)=>{
        if(!user){
            res.status(200).json({success: false, error:"Email not registered"})
        }else{
            bcryptjs.compare(password, user.password, (err,isMatch)=>{
                if(isMatch){
                    let token = jwt.sign({email:user.email},"jwt",{
                        expiresIn: 60*60*6
                    });
                    res.status(200).json({
                        success:true,
                        user:{
                            id:user.id,
                            givenName:user.givenName,
                            familyName:user.familyName,
                            email:user.email,
                        },token:token
                    })
                }else{
                    res.status(200).json({success:false, error:"Password doesn't match"})
                }
            })
        }
    })
}

exports.checkUser= function(req,res){
    jwt.verify(req.body.token,"jwt",(err,decode)=>{
        if(err){
            res.send({'status':"10010"});
        }else{
            res.send({"status":"10000"})
        }
    })
}

exports.updateUser = function(req,res){
    bcryptjs.genSalt(16,(err,salt) =>{
        bcryptjs.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
            User.findOneAndUpdate({email:req.body.email},{
                givenName : req.body.givenName,
                familyName : req.body.familyName,
                email:req.body.email,
                password: hash
            },
            {new: true},
            function(err, updateUser){
                if(err){
                    res.status(200).json({success:false,message: "Email doesn't exist"})
                }else{
                    res.status(200).json({success:true,updateUser:updateUser})
                }
            })
        })
    })
}

User.create