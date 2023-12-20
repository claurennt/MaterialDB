import nodemailer from 'nodemailer';

const { NEXT_PUBLIC_EMAIL, NEXT_PUBLIC_PASSWORD, NEXT_PUBLIC_URL } =
  process.env;
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV;

const BASEURL =
  environment === 'development'
    ? `http://localhost:${port}`
    : `${NEXT_PUBLIC_URL}`;

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

const sendEmail = async (message) => {
  try {
    await transporter.sendMail(message);
  } catch (err) {
    throw new Error('Error: something went wrong. Email not sent');
  }
};

const sendActivationEmail = ({ name, email, _id }) => {
  const activationLink = `${BASEURL}/api/auth/activate/${_id}`;

  const message = {
    from: NEXT_PUBLIC_EMAIL,
    // to: toUser.email // in production uncomment this
    to: email,
    subject: 'Material DB - Activate Account',
    html: `
      <h3> Hello ${name} </h3>
      <p>Thank you for registering for Material DB. Much Appreciated! Just one last step is laying ahead of you...</p>
      <a href=${activationLink}>Activate profile</a>
      <p>Cheers</p>
      <p>Material DB Team</p>
    `,
  };

  return sendEmail(message);
};

const sendRegistrationConfirmationEmail = ({ name, email }) => {
  const message = {
    from: NEXT_PUBLIC_EMAIL,
    // to: toUser.email // in production uncomment this
    to: email,
    subject: 'Material DB - Registration successful',
    html: `
      <h3> Hi ${name} </h3>
      <p>Your account has been successfully activated. You can now start using the app - have fun!</p>
      <a href=${BASEURL}/auth/login target="_">Go to login</a>
      <p>Cheers</p>
      <p>Material DB Team</p>
    `,
  };

  return sendEmail(message);
};

export { sendActivationEmail, sendRegistrationConfirmationEmail };
