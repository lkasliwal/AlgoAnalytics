const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema=mongoose.Schema({
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
   verified:{
     type: Boolean,
     default: false
   },
   role:{
    type: String,
    default: ""
   },
   tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

userSchema.pre('save', async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,8);
        next();
    }
})

userSchema.statics.findByCredentials = async function(email,password){
    const user = await User.findOne({email,verified:true});
    if(!user)
        throw new Error('Unable to login');
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch)
        throw new Error('Unable to login');
    return user;
}

userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id:user._id},'aqualityadmin');
    user.tokens = user.tokens.concat({token});
    await user.save();
    // return token;
}
const User = mongoose.model('User',userSchema);
module.exports = User;