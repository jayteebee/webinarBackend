const nodemailer = require('nodemailer');

// Configure nodemailer transport using environment variables
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL || "jethro@thermalvisionresearch.co.uk",
    pass: process.env.PASSWORD || "ThermalVR2k4",
  },
});

// Netlify function handler
exports.handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': 'http://localhost:8888',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests (HTTP OPTIONS method)
  if (event.httpMethod === 'OPTIONS') {
    // Return a 200 status for preflight checks
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight checks passed' }),
    };
  }

  // Handle POST requests
  if (event.httpMethod === 'POST') {
    try {
      // Parse the request body
      const data = JSON.parse(event.body);
      const { firstName, email, phoneNumber, submittedAt } = data;

      // Mail options for the user as a thank-you response
      const mailOptionsUser = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Thank you for registering to our Webinar Series',
        html: `
          <p>Hello ${firstName},</p>
          <p>Thank you for registering to our webinar series. Your calendar invitation should be with you shortly.</p>
          <p>Kind Regards,<br>Jethro Block<br>Business Development Manager<br>07948 725 229<br>www.thermalvisionecology.co.uk<br>2530 The Quadrant, Aztec West, Bristol BS32 4AQ</p>
          <img src="https://i.ibb.co/84j63Ww/tvrLOGO.webp" alt="tvrLOGO" border="0" height="70px">
        ` // Include your email signature as an image or HTML here
      };

      // Send thank-you email to the user
      await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptionsUser, (error, info) => {
          if (error) reject(error);
          else resolve(info);
        });
      });


 // Additional POST request to Zapier
 const zapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/18365503/37hs1dq/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
});

if (!zapierResponse.ok) throw new Error('Failed to send data to Zapier');


      // Return success response with CORS headers
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Added row to spreadsheet' }),
      };
    } catch (error) {
      // Catch any errors and return a 500 error response with CORS headers
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }

  // Respond to any other HTTP methods with a Method Not Allowed status
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ message: 'Method Not Allowed' }),
  };
};
