import { Types } from 'mongoose';
import nodemailer from 'nodemailer';

const { NODEMAILER_EMAIL, NODEMAILER_PASSWORD, PROJECT_URL } = process.env;
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV;

type Message = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

type SendActivationEmail = { name: string; email: string; _id: Types.ObjectId };

const BASEURL =
  environment === 'development' ? `http://localhost:${port}` : `${PROJECT_URL}`;

//create transporter object with config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASSWORD,
  },
});

const sendEmail = async (message: Message) => {
  try {
    await transporter.sendMail(message);
  } catch (err) {
    console.log('err email', err);
    throw new Error('Error: something went wrong. Email not sent');
  }
};

const sendActivationEmail = ({ name, email, _id }: SendActivationEmail) => {
  const activationLink = `${BASEURL}/api/auth/activate/${_id}`;

  const message = {
    from: NODEMAILER_EMAIL,
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

const sendRegistrationConfirmationEmail = (name: string, email: string) => {
  const message = {
    from: NODEMAILER_EMAIL,
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
