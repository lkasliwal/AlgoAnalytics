
const nodemailer = require('nodemailer')
const crypto = require('crypto');
const sendError = require('./helper');

const generateTranporter = () => {
  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "tnirmal@algoanalytics.com",
      pass: "legbrnxgxemrebha"
    }
  });
}

const generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) reject(err);
      const buffString = buff.toString("hex");

      resolve(buffString);
    });
  });
};

const notFoundRoute = function (req, res) {
  // sendError()
  this.sendError(res, 'Route not found', 404)
}

module.exports = { generateRandomByte, notFoundRoute }