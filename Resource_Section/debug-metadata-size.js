const fs = require('fs');
const { validateRates } = require('./Controllers/Resource/validateRates');

// Load the failing JSON
const jsonData = JSON.parse(fs.readFileSync('./examples/createResourceWithRates.json', 'utf8'));

console.log('=== DEBUGGING METADATA SIZE ISSUE ===');
console.log('Original JSON size:', JSON.stringify(jsonData).length, 'characters');

// Simulate the metadata construction from Limitations function
let metadata = jsonData.metadata || {};

// Validate rates first
if (jsonData.rates && jsonData.rates.length > 0) {
    const rateValidation = validateRates(jsonData.rates);
    if (rateValidation.isValid) {
        jsonData.rates = rateValidation.validatedRates;
    }
}

// Build metadata exactly like in Limitations function
metadata = {
    ...metadata,
    capacity: jsonData.capacity,
    resource_plans: jsonData.resource_plans,
    category: jsonData.category,
    email_confirmation: jsonData.email_confirmation,
    resource_details: jsonData.resource_details,
    photo_url: jsonData.photo_url,
    rates: jsonData.rates
};

console.log('\n=== METADATA ANALYSIS ===');
console.log('Final metadata size:', JSON.stringify(metadata).length, 'characters');
console.log('Final metadata size (bytes):', Buffer.byteLength(JSON.stringify(metadata), 'utf8'), 'bytes');

console.log('\n=== METADATA BREAKDOWN ===');
Object.keys(metadata).forEach(key => {
    const value = metadata[key];
    const size = JSON.stringify(value).length;
    console.log(`${key}: ${size} characters`);

    if (key === 'rates' && Array.isArray(value)) {
        console.log(`  - Number of rates: ${value.length}`);
        value.forEach((rate, index) => {
            console.log(`  - Rate ${index + 1} (${rate.price_name}): ${JSON.stringify(rate).length} characters`);
        });
    }
});

console.log('\n=== POTENTIAL ISSUES ===');

// Check for common API issues
if (JSON.stringify(metadata).length > 65536) {
    console.log('❌ ISSUE: Metadata exceeds 64KB limit (common API limit)');
}

if (JSON.stringify(metadata).length > 1048576) {
    console.log('❌ ISSUE: Metadata exceeds 1MB limit');
}

// Check for nested object depth
function getObjectDepth(obj, depth = 0) {
    if (typeof obj !== 'object' || obj === null) return depth;
    return Math.max(...Object.values(obj).map(v => getObjectDepth(v, depth + 1)));
}

const depth = getObjectDepth(metadata);
console.log(`Metadata nesting depth: ${depth} levels`);

if (depth > 10) {
    console.log('❌ ISSUE: Metadata nesting too deep (>10 levels)');
}

// Check for circular references
try {
    JSON.stringify(metadata);
    console.log('✅ No circular references detected');
} catch (err) {
    console.log('❌ ISSUE: Circular reference detected:', err.message);
}

// Check individual field sizes
console.log('\n=== FIELD SIZE ANALYSIS ===');
if (metadata.rates) {
    console.log(`Rates array: ${metadata.rates.length} items, ${JSON.stringify(metadata.rates).length} characters`);
}
if (metadata.resource_plans) {
    console.log(`Resource plans: ${JSON.stringify(metadata.resource_plans).length} characters`);
}
if (metadata.resource_details) {
    console.log(`Resource details: ${JSON.stringify(metadata.resource_details).length} characters`);
}

console.log('\n=== FINAL PAYLOAD SIMULATION ===');
const finalPayload = {
    name: jsonData.resource_name,
    metadata: metadata,
    max_simultaneous_bookings: 1
};

console.log('Complete API payload size:', JSON.stringify(finalPayload).length, 'characters');
console.log('Complete API payload size (bytes):', Buffer.byteLength(JSON.stringify(finalPayload), 'utf8'), 'bytes');

// Show the actual payload structure (truncated)
console.log('\n=== PAYLOAD STRUCTURE (first 500 chars) ===');
const payloadStr = JSON.stringify(finalPayload, null, 2);
console.log(payloadStr.substring(0, 500) + (payloadStr.length > 500 ? '...' : ''));

console.log('\n=== COMPARISON WITH WORKING EXAMPLE ===');
const minimalData = JSON.parse(fs.readFileSync('./examples/createResourceMinimal.json', 'utf8'));
console.log('Minimal example size:', JSON.stringify(minimalData).length, 'characters');
console.log('Size difference:', JSON.stringify(jsonData).length - JSON.stringify(minimalData).length, 'characters');