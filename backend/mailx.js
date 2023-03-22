module.exports = async function (content) {
  var nodemailer = require("nodemailer");
  var transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: "no.reply.timescheduler@gmail.com",
      pass: "vqbxciegmkuxlqap",
    },
    debug: false,
    logger: true,
  });

  var mailOptions = {
    from: "no.reply.timescheduler@gmail.com",
    to: content.to,
    subject: content.subject,
    text: content.message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
