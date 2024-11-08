const nodemailer = require('nodemailer');
require('dotenv').config()


// Configure nodemailer transport using environment variables
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL || "jethro@thermalvisionresearch.co.uk" ,
    pass: process.env.PASSWORD || "ThermalVR2k4"
  },
});


// Netlify function handler
exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': "https://www.thermalvisionresearch.com",
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight checks passed' }),
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body);
      const { firstName, email } = data;

      const mailOptionsUser = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Thank you for registering for our Unlocking Precision: Using FLIR R&D Cameras for Advanced PCB Thermal Analysis!',
        html: `
          <p>Hello ${firstName},</p>
          <p>Thank you for registering to the Unlocking Precision: Using FLIR R&D Cameras for Advanced PCB Thermal Analysis webinar, 21st November - 11am to 12pm. </p>
          <p> Your calendar invitation should be with you shortly. If it hasn't arrived after a few minutes, please check your junk/spam folder.</p>
          <img src="https://i.ibb.co/bbqHvvs/Webinar-Thank-You-Flyer-1.png" alt="Webinar-Thank-You-Flyer-1" border="0">
          <p>Kind Regards,<br>Jethro Block<br>Business Development Manager<br>07948 725 229<br>www.thermalvisionresearch.co.uk<br>2530 The Quadrant, Aztec West, Bristol BS32 4AQ</p>
          <img src="https://i.ibb.co/MZVdWzw/tvr-LOGO-1.png" alt="tvr-LOGO-1" border="0">
        `,
      };

      // Send the email
      await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptionsUser, (error, info) => {
          if (error) reject(error);
          else resolve(info);
        });
      });

      // Zapier / Google Sheets integration
      const zapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/18365503/37hs1dq/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!zapierResponse.ok) throw new Error('Failed to send data to Zapier');

      // Additional POST request to Zapier or handling other responses
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Added row to spreadsheet and sent email' }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ message: 'Method Not Allowed' }),
  };
};
