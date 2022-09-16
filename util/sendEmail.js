import nodemailer from 'nodemailer';

export async function sendEmail(email, subject, text = '', html = '') {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  try {
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASS, // generated ethereal password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text,
      html: html,
    });
    console.log('email sent sucessfully');
  } catch (error) {
    console.log('email not sent');
    console.log(error);
    throw error;
  }
}

export async function sendEmailVerify(userId, token, email) {
  const html = `Press <a href=${process.env.BASE_URL}/api/users/verify/${userId}/${token}> here </a> to verify your email. Thanks`;
  await sendEmail(email, 'Verify Email', '', html);
}
