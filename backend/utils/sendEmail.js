import nodemailer from "nodemailer"

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    
    host : process.env.SMPTP_HOST,
    port : process.env.SMPTP_PORT,
    service : process.env.SMTP_SERVICE,
    auth : {
      user : process.env.SMTP_MAIL,
      pass : process.env.SMTP_PASSWORD
    }
  })

  const mailOptions = {
    from : process.env.SMTP_USER,
    to : options.email,
    subject : options.subject,
    text : options.message
  }

  await transporter.sendMail(mailOptions)
}

export default sendEmail