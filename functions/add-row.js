// const nodemailer = require('nodemailer');
// const ical = require('ical-generator');


// // Configure nodemailer transport using environment variables
// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: process.env.EMAIL || "jethro@thermalvisionresearch.co.uk",
//     pass: process.env.PASSWORD || "ThermalVR2k4",
//   },
// });

// // Netlify function handler
// exports.handler = async (event) => {
//   // Set CORS headers
//   const headers = {
//     'Access-Control-Allow-Origin': 'http://localhost:8888',
//     'Access-Control-Allow-Headers': 'Content-Type',
//     'Access-Control-Allow-Methods': 'POST, OPTIONS',
//     'Content-Type': 'application/json'
//   };

//   // Handle preflight requests (HTTP OPTIONS method)
//   if (event.httpMethod === 'OPTIONS') {
//     // Return a 200 status for preflight checks
//     return {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify({ message: 'CORS preflight checks passed' }),
//     };
//   }

//   // Handle POST requests
//   if (event.httpMethod === 'POST') {
//     const data = JSON.parse(event.body);
//     const { firstName, email, submittedAt } = data;

//     // Correct initialization of calendar
//     const calendar = ical({name: 'Webinar Series'});  // This line is correctly calling the constructor

//     const startDate = new Date('2024-04-26T09:00:00Z');
//     const endDate = new Date(startDate.getTime() + 1800000);  // 30 minutes after start

//     // Create event
//     calendar.createEvent({
//       start: startDate,
//       end: endDate,
//       summary: 'Webinar Registration',
//       description: 'Thank you for registering to our webinar series.',
//       organizer: 'jethro@thermalvisionresearch.co.uk',
//       attendees: [{email: email, name: firstName}]
//     });

//     // Generate the .ics file content
//     const icsString = calendar.toString();

//     // Mail options including the .ics file attachment
//     const mailOptionsUser = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: 'Thank you for registering to our Webinar Series',
//       html: `
//         <p>Hello ${firstName},</p>
//         <p>Thank you for registering to our webinar series. Your calendar invitation should be with you shortly.</p>
//         <p>Kind Regards,<br>Jethro Block<br>Business Development Manager<br>07948 725 229<br>www.thermalvisionecology.co.uk<br>2530 The Quadrant, Aztec West, Bristol BS32 4AQ</p>
//         <img src="https://i.ibb.co/092hq5D/tvrLOGO.png" alt="tvrLOGO" border="0" height="70px">
//       `,
//       attachments: [{
//         filename: 'event.ics',
//         content: icsString,
//         contentType: 'text/calendar'
//       }]
//     };

//       // Send thank-you email to the user
//       await new Promise((resolve, reject) => {
//         transporter.sendMail(mailOptionsUser, (error, info) => {
//           if (error) reject(error);
//           else resolve(info);
//         });
//       });


//  // Additional POST request to Zapier
//  const zapierResponse = await fetch('https://hooks.zapier.com/hooks/catch/18365503/37hs1dq/', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(data)
// });

// if (!zapierResponse.ok) throw new Error('Failed to send data to Zapier');


//       // Return success response with CORS headers
//       return {
//         statusCode: 200,
//         headers,
//         body: JSON.stringify({ message: 'Added row to spreadsheet' }),
//       };
//     } catch (error) {
//       // Catch any errors and return a 500 error response with CORS headers
//       return {
//         statusCode: 500,
//         headers,
//         body: JSON.stringify({ error: error.message }),
//       };
//     }
//   }

//   // Respond to any other HTTP methods with a Method Not Allowed status
//   return {
//     statusCode: 405,
//     headers,
//     body: JSON.stringify({ message: 'Method Not Allowed' }),
//   };
// };

const nodemailer = require('nodemailer');
const { ICalCalendar } = require('ical-generator');

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

      // Initialize the calendar
      const calendar = new ICalCalendar({
        name: 'Webinar Series'
      });

      const startDate = new Date('2024-04-27T10:00:00Z');
      const endDate = new Date(startDate.getTime() + 1800000); // 30 minutes later

      // Create event
      calendar.createEvent({
        start: startDate,
        end: endDate,
        summary: 'Webinar Registration',
        description: "Thank you for registering to our webinar series. Here's the Teams Link: https://teams.live.com/meet/9490174204348?p=64hAidQNYoUe0FYd",
        organizer: {name: 'Jethro Block', email: 'jethro@thermalvisionresearch.co.uk'},
        attendees: [{
          email: email,
          name: firstName,
          rsvp: true,
          role: 'REQ-PARTICIPANT',
          status: 'ACCEPTED'
        }]
      });

      // Generate the .ics file content
      const icsString = calendar.toString();

      // Mail options for the user as a thank-you response
      const mailOptionsUser = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Thank you for registering to our Webinar Series',
        html: `
          <p>Hello ${firstName},</p>
          <p>Thank you for registering to our webinar series. Your calendar invitation should be with you shortly.</p>
<p>          You're invited to join a Microsoft Teams meeting </p>
<p>Join on your computer or mobile app </p>
<table cellspacing="0" cellpadding="0"> <tr>
<td align="center" width="200" height="40" bgcolor="#4CAF50" style="border-radius: 2px;" bgcolor="#000000">
  <a href="https://teams.live.com/meet/9490174204348?p=64hAidQNYoUe0FYd" 
    target="_blank" 
    style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 2px; border: 1px solid #4CAF50; display: inline-block;">
    Attend Meeting
  </a>
</td>
</tr> </table>
          <p>Kind Regards,<br>Jethro Block<br>Business Development Manager<br>07948 725 229<br>www.thermalvisionecology.co.uk<br>2530 The Quadrant, Aztec West, Bristol BS32 4AQ</p>
          <img src="https://i.ibb.co/092hq5D/tvrLOGO.png" alt="tvrLOGO" border="0" height="70px">
        `,
        attachments: [{
          filename: 'event.ics',
          content: icsString,
          contentType: 'text/calendar'
        }]
      };

      // Send the email
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
