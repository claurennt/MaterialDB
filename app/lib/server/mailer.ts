import nodemailer from 'nodemailer';
import { PROJECT_URL } from '../../../globals';

const { NODEMAILER_EMAIL, NODEMAILER_PASSWORD } = process.env;
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV;

type Message = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

type SendActivationEmailParams = {
  username: string;
  email: string;
  token: string;
};

const BASEURL =
  environment === 'development' ? `http://localhost:${port}` : PROJECT_URL;

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

const sendActivationEmail = ({
  username,
  email,
  token,
}: SendActivationEmailParams) => {
  const activationLink = `${BASEURL}/activate?token=${token}`;

  const message = {
    from: NODEMAILER_EMAIL || '',
    to: email,
    subject: 'Material DB - Activate Account',
    html: `
      <h1> Hello ${username}</h1>
      <p>Thank you for registering for Material DB. Much Appreciated! Just one last step is laying ahead of you...</p>
      <a href=${activationLink}>Activate profile</a>
      <p>Cheers</p>
      <p>Material DB Team</p>
    `,
  };

  return sendEmail(message);
};

const sendRegistrationConfirmationEmail = ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {
  const message = {
    from: NODEMAILER_EMAIL || '',
    to: email,
    subject: 'Material DB - Registration successful',
    html: `
      <h1> Hi ${username} </h1>
      <p>Your account has been successfully activated. You can now start using the app - have fun!</p>
      <a href=${BASEURL}/auth/login target="_">Start using MaterialDB!</a>
      <p>Cheers</p>
      <p>Material DB Team</p>
    `,
  };

  return sendEmail(message);
};

export { sendActivationEmail, sendRegistrationConfirmationEmail };
