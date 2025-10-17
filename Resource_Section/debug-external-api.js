const axios = require('axios');
require('dotenv').config();

// Test what the external API receives
async function testExternalAPI() {
    console.log('=== TESTING EXTERNAL HAPIO API DIRECTLY ===');
    
    // Create the exact payload that our createResource function sends
    const testPayload = {
        "name": "Direct API Test Room " + Date.now(),
        "metadata": {
            "capacity": 10,
            "resource_plans": [
                {
                    "plan_name": "Standard"
                    // Missing features array!
                }
            ],
            "category": "meeting_room",
            "email_confirmation": true,
            "resource_details": {
                "description": "Test room",
                "floor": 2
            },
            "photo_url": "https://example.com/test.jpg",
            "rates": [
                {
                    "price_name": "Test Rate",
                    "description": "Test rate",
                    "price": 50,
                    "renewal_type": "every hour",
                    "created_at": new Date().toISOString()
                }
            ]
        },
        "max_simultaneous_bookings": 1
    };
    
    console.log('Payload size:', JSON.stringify(testPayload).length, 'characters');
    console.log('Payload structure:');
    console.log(JSON.stringify(testPayload, null, 2));
    
    try {
        const apiClient = axios.create({
            baseURL: 'https://eu-central-1.hapio.net/v1/',
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        
        console.log('\n=== MAKING DIRECT API CALL ===');
        const response = await apiClient.post('resources', testPayload);
        
        console.log('✅ SUCCESS!');
        console.log('Response:', response.data);
        
    } catch (error) {
        console.log('❌ EXTERNAL API ERROR:');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Status Text:', error.response.statusText);
            console.log('Response Data:', JSON.stringify(error.response.data, null, 2));
            
            if (error.response.status === 422) {
                console.log('\n=== 422 ANALYSIS ===');
                console.log('This means the external API rejected our data structure');
                console.log('Common causes:');
                console.log('- Missing required fields in nested objects');
                console.log('- Invalid enum values');
                console.log('- Malformed data structures');
                console.log('- Field validation failures');
            }
        } else {
            console.log('Network Error:', error.message);
 