const nodemailer = require('nodemailer');

//TODO: Fix logic for sending email

async function sendEmail(name, email, message) {
  // Create a transporter using SMTP
  const transporter = nodemailer.createTransporter({
    service: 'gmail', // or another service like 'outlook', 'yahoo', etc.
    auth: {
      user: 'your-email@gmail.com', // replace with your email that will send messages
      pass: 'your-app-password' // replace with your app password or email password
    }
  });

  // Email content configuration
  const mailOptions = {
    from: `"Website Contact Form" <your-email@gmail.com>`,
    to: 'your-personal-email@example.com', // replace with your personal email where you want to receive messages
    subject: `New message from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      
      Message:
      ${message}
    `,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <h4>Message:</h4>
      <p>${message}</p>
    `
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = sendEmail;
