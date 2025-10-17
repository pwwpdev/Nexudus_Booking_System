const axios = require('axios');
const fs = require('fs');

async function debugApiCall() {
    try {
        console.log('=== DEBUGGING API CALL ===');

        // Load the failing JSON
        const jsonData = JSON.parse(fs.readFileSync('./examples/createResourceWithRates.json', 'utf8'));

        // Make the resource name unique to avoid duplicate error
        jsonData.resource_name = "Debug Test Room " + Date.now();

        console.log('Testing with resource name:', jsonData.resource_name);
        console.log('Request payload size:', JSON.stringify(jsonData).length, 'characters');

        // Make the API call
        const response = await axios.post('http://localhost:3000/createResource', jsonData, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 60000, // 60 second timeout
            validateStatus: function (status) {
                return true; // Don't throw on any status code
            }
        });

        console.log('\n=== RESPONSE ===');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));

        if (response.status >= 400) {
            console.log('\n=== ERROR ANALYSIS ===');
            console.log('This is the actual error from the API');

            // Check if it's a server error vs client error
            if (response.status >= 500) {
                console.log('❌ SERVER ERROR: Issue on the backend');
            } else if (response.status >= 400) {
                console.log('❌ CLIENT ERROR: Issue with the request data');
            }
        } else {
            console.log('✅ SUCCESS: Resource created successfully');
        }

    } catch (error) {
        console.error('\n=== NETWORK/CONNECTION ERROR ===');
        if (error.code === 'ECONNREFUSED') {
            console.error('❌ Server is not running on localhost:3000');
        } else if (error.code === 'ETIMEDOUT') {
            console.error('❌ Request timed out');
        } else {
            console.error('❌ Error:', error.message);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            }
        }
    }
}

debugApiCall();