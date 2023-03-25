const express = require('express')
const Router = express.Router()
const User = require('../models/user')
const { create, verifyEmail, resendEmailVerificationToken, forgotPassword, sentResetPasswordStatus, resetPassword, signIn, editOrganisation } = require('../controllers/user')
const isAuth = require('../middlewares/auth')
const isValidResetPasswordToken = require('../middlewares/isValidResetPasswordToken')
const { userValidator, validate, ValidatePassword, signInValidator, companyValidator} = require('../middlewares/validator')

require('../dbConnection/mongoose')

Router.post('/create', userValidator, validate, create)
Router.post('/verify-email', verifyEmail)
Router.post('/resend-email-verification-token', resendEmailVerificationToken)
Router.post('/forgot-password', forgotPassword)
Router.post('/verify-reset-pass-token', isValidResetPasswordToken, sentResetPasswordStatus)
Router.post('/reset-password', ValidatePassword, validate, isValidResetPasswordToken, resetPassword)
Router.post('/edit-organisation',companyValidator,validate,editOrganisation)
Router.get("/is-auth", isAuth, (req, res) => {
    const { user } = req;
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
});
Router.post('/sign-in', signInValidator, validate, signIn)

module.exports = Router;

