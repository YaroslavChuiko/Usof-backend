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
  //? mb get userId from jwt token instead url
  // ! mb change link to front-end that query to ${process.env.BASE_URL}/api/users/verify/${userId}/${token} and show result
  const html = `<p>You must follow this link within 30 days to verify your email</p>Press <a href=${process.env.BASE_URL}/api/users/verify/${userId}/${token}> here </a> to verify your email. Thanks`;
  await sendEmail(email, 'Verify Email', '', html);
}

export async function sendEmailPasswordReset(token, email) {
  const html = `<p>You requested for reset password, kindly use this <a href="http://front-end_base_url/reset-password/${token}">link</a> to reset your password</p>`;
  await sendEmail(email, 'Reset Password Link - siteName.com', '', html);
}
