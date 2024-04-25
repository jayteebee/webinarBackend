// Netlify function handler
exports.handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': 'https://www.thermalvisionecology.co.uk',
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
