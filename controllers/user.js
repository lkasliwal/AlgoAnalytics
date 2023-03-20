


const nodemailer = require('nodemailer')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const EmailVerificationToken = require('../models/emailVerificationToken');
const { isValidObjectId } = require('mongoose');
const sendError = require('../utils/helper');
const PasswordResetToken = require('../models/passwordResetToken');
const { generateRandomByte } = require('../utils/mail');
const passwordResetToken = require('../models/passwordResetToken');






const create = async (req, res) => {
    const { name, email, password } = req.body

    const oldUser = await User.findOne({ email,isVerified:true});
    if (oldUser) return sendError(res, "This email is already in use!")
    const oldUnverifiedUser = await User.findOne({email,isVerified:false});
    if(!oldUnverifiedUser){
        const newUser = new User({ name, email, password })
        await newUser.save()
    }
    // generate 6 digit otp


    let OTP = "";
    for (let i = 1; i <= 6; i++) {
        const randomVal = Math.round(Math.random() * 9);
        OTP += randomVal;
    }


    // store otp inside our db
    const emailToken = await EmailVerificationToken.findOne({owner:newUser._id});
    if(emailToken){
        emailToken.token = OTP;
        await emailToken.save();
    }
    else{
        const newEmailVerificationToken = new EmailVerificationToken({ owner: newUser._id, token: OTP })
        await newEmailVerificationToken.save()
    }
    //   // send that otp to our user

    var transport = nodemailer.createTransport({

        service: 'gmail',

        auth: {
            user: "harshalrajput312@gmail.com",
            pass: "legbrnxgxemrebha"
        }
    });

    var mailOptions = {
        from: 'verification@defectdetection.com',
        to: newUser.email,
        subject: 'Email Verification',
        html: `
      <p>You verification OTP</p>
      <h1>${OTP}</h1>
    `
    }

    transport.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log('email was successfully sent to user ')
        }

    })

    res.status(201).json({
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role:newUser.role
        }
    }
    )
};

const verifyEmail = async (req, res) => {
    const { email, OTP } = req.body
    const userExist = await User.findOne({email});
    const userId = userExist._id;
    if (!isValidObjectId(userId)) return sendError(res, "Invalid user!")

    // const user = await User.findById(userId)
    // if (!user) return sendError(res, "user not found!", 404)

    if (userExist.isVerified) return sendError(res, "user is already verified!")

    const token = await EmailVerificationToken.findOne({ owner: userId })
    console.log("email verification token is",token);
    if (!token) return sendError(res, 'token not found!')

    const isMatched = await token.compareToken(OTP)
    if (!isMatched) return sendError(res, 'Please submit a valid OTP!')

    userExist.isVerified = true;
    await userExist.save();

    await EmailVerificationToken.findByIdAndDelete(token._id);

    var transport = nodemailer.createTransport({

        service: 'gmail',

        auth: {
            user: "harshalrajput312@gmail.com",
            pass: "legbrnxgxemrebha"
        }
    });

    var mailOptions = {
        from: 'verification@defectdetection.com',
        to: userExist.email,
        subject: 'Welcome Email',
        html: '<h1>Welcome to our app and thanks for choosing us.</h1>'
    }
    transport.sendMail(mailOptions, function (err, res) {
        if (err) {
            console.log(err)
        } else {
            console.log("welcome msg wa sent to user")
        }
    })
    //After verification user don't have to login agin as user is genuine user so we will not redirect user to again put their credientials we will send jwt token instead
    const jwtToken = jwt.sign({ userId: userExist._id }, process.env.JWT_SECRET);
    res.json({ user: { id: userExist._id, name: userExist.name, email: userExist.email,role:userExist.role, isVerified: userExist.isVerified, token: jwtToken }, message: "Your email is verified." })
}

const resendEmailVerificationToken = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne(email);
    if (!user) return sendError(res, "user not found!");

    if (user.isVerified)
        return sendError(res, "This email id is already verified!");
    const alreadyHasToken = await EmailVerificationToken.findOne({
        owner: user._id,
    });
    if (alreadyHasToken)
        return sendError(res, "Only after one hour you can request for another token!");

    //    generate otp
    let OTP = "";
    for (let i = 1; i <= 6; i++) {
        const randomVal = Math.round(Math.random() * 9);
        OTP += randomVal;
    }

    //   // store otp inside our db
    const newEmailVerificationToken = new EmailVerificationToken({ owner: user._id, token: OTP })
    console.log(newEmailVerificationToken.owner._id)
    await newEmailVerificationToken.save()

    //   // send that otp to our user



    var transport = nodemailer.createTransport({

        service: 'gmail',

        auth: {
            user: "harshalrajput312@gmail.com",
            pass: "legbrnxgxemrebha"
        }
    });
    var mailOptions = {
        from: 'verification@defectdetection.com',
        to: user.email,
        subject: 'Email Verification',
        html: `
      <p>You verification OTP</p>
      <h1>${OTP}</h1>
    `
    }

    transport.sendMail(mailOptions, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log('email verification token send to user')
        }
    })

    res.json({
        message: "New OTP has been sent to your registered email accout.",
    });
};

const forgotPassword = async (req, res) => {

    const { email } = req.body;

    if (!email) return sendError(res, "email is missing!");

    const user = await User.findOne({ email });
    if (!user) return sendError(res, "User not found!", 404);

    const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id });
    if (alreadyHasToken)
        return sendError(
            res,
            "Only after one hour you can request for another token!"
        );

    const token = await generateRandomByte();
    const newPasswordResetToken = await PasswordResetToken({
        owner: user._id,
        token,
    });
    await newPasswordResetToken.save();

    const resetPasswordUrl = `http://localhost:3000/passwordreset?token=${token}&id=${user._id}`;

    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "harshalrajput312@gmail.com",
            pass: "legbrnxgxemrebha"
        }
    });
    var mailOptions = {
        from: 'Random@defectdetection.com',
        to: user.email,
        subject: 'Reset Password Link',
        html: `
         <p>click here to reset password</p>
         <a href='${resetPasswordUrl}'>Change Password</a>
           
         `
    }

    transport.sendMail(mailOptions, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log('Reset Password link send to user')
        }
    })

    res.json({
        message: "Reset Password Link send to your email.",
    });

}

const sentResetPasswordStatus = (req, res) => {
    return res.json({ valid: true })
}

const resetPassword = async (req, res) => {
    console.log('reet pass')

    const { userId, newPassword } = req.body;
    const user = await User.findById(userId)

    console.log(userId)
    const matched = await user.comparePassword(newPassword);



    if (matched) return sendError(res, "Please enter new password other than older one!!!")





    user.password = newPassword;
    await user.save();

    await passwordResetToken.findByIdAndDelete(req.resetToken._id)
    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "harshalrajput312@gmail.com",
            pass: "legbrnxgxemrebha"
        }
    });
    var mailOptions = {
        from: 'Random@defectdetection.com',
        to: user.email,
        subject: ' Password Reset ',
        html: `
        <h1> Password  reset successfully</h1>
        
          
        `
    }

    transport.sendMail(mailOptions, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log('password reset succefully')
        }
    })
    res.json({ message: "Password  reset successfully" })

}

const signIn = async (req, res) => {

     if(req) console.log("requet from frontend")
    const { password, email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return sendError(res, 'Incorrect mail or password ');

    const match = await user.comparePassword(password);
    if (!match) {
        return sendError(res, 'Incorrect mail or password');
    }
    const { _id, name, isVerified,role } = user;
    const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET);

    return res.json({ user: { Id: _id, name,role, email, isVerified, token: jwtToken } })




}



module.exports = { create, verifyEmail, resendEmailVerificationToken, forgotPassword, sentResetPasswordStatus, resetPassword, signIn }
