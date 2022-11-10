import nodemailer from 'nodemailer';

const { NEXT_PUBLIC_EMAIL, NEXT_PUBLIC_PASSWORD } = process.env;

//create transporter object with config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: NEXT_PUBLIC_EMAIL,
    pass: NEXT_PUBLIC_PASSWORD,
  },
});

const sendEmail = (message) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('err from sendMail', err);
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};

const sendConfirmationEmail = ({ username, email, _id }) => {
  const message = {
    from: NEXT_PUBLIC_EMAIL,
    // to: toUser.email // in production uncomment this
    to: email,
    subject: 'Material DB - Activate Account',
    html: `
      <h3> Hello ${username} </h3>
      <p>Thank you for registering for Material DB. Much Appreciated! Just one last step is laying ahead of you...</p>
      <p>To activate your account please follow this link: <a target="_" href="http://localhost:3000/api/auth/activate/${_id}">Activation Link </a></p>
      <p>Cheers</p>
      <p>Material DB Team</p>
    `,
  };

  return sendEmail(message);
};

const sendResetPasswordEmail = ({ user: { username, email }, _id }) => {
  // const message = {
  //   from: NEXT_PUBLIC_EMAIL,
  //   // to: toUser.email // in production uncomment this
  //   to: email,
  //   subject: 'Material DB - Reset Password',
  //   html: `
  //     <h3>Hello ${username} </h3>
  //     <p>To reset your password please follow this link: <a target="_" href="${DOMAIN}/api/auth/reset-password/${hash}">Reset Password Link</a></p>
  //     <p>Cheers,</p>
  //     <p>Material DB Team</p>
  //   `,
  // };
  // return sendEmail(message);
};

export { sendConfirmationEmail, sendResetPasswordEmail };