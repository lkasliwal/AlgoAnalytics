const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const operatorSchema=mongoose.Schema({
   name:{
     type:String,
     required:true,
     trim:true
   },
   email:{
    unique:true,
    type:String,
    required:true,
    trim:true
   },
   password:{
     type:String,
     required:true
   },
   token: [{
    token: {
      type: String,
      required: true
    }
  }]
})