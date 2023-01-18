const mongoose=require('mongoose');

const partSchema=mongoose.Schema({
    part_name:{
      type:String,
      required:true,
      trim:true
    },
    part_ok:{
     type:Number,
     required:true
    },
    part_not_ok:{
      type:Number,
      required:true
    },
    precision:{
      type: Number,
      default: 0
    },
    recall: {
      type: Number,
      default: 0
    },
    map:{
      type: Number,
      default: 0
    }
 })

 module.exports = mongoose.model('Part',partSchema)