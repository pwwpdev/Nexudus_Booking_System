const fs = require('fs');

console.log('=== STRUCTURE COMPARISON ANALYSIS ===');

// Load both files
const failingData = JSON.parse(fs.readFileSync('./examples/createResourceWithRates.json', 'utf8'));
const workingData = JSON.parse(fs.readFileSync('./examples/createResourceMinimal.json', 'utf8'));

console.log('\n=== FIELD COMPARISON ===');

// Get all unique fields from both
const allFields = new Set([...Object.keys(failingData), ...Object.keys(workingData)]);

allFields.forEach(field => {
    const inFailing = field in failingData;
    const inWorking = field in workingData;

    if (inFailing && inWorking) {
        console.log(`✅ ${field}: Present in both`);

        // Check if structures match
        const failingType = typeof failingData[field];
        const workingType = typeof workingData[field];

        if (failingType !== workingType) {
            console.log(`   ❌ Type mismatch: failing(${failingType}) vs working(${workingType})`);
        }

        // Special checks for arrays and objects
        if (Array.isArray(failingData[field]) && Array.isArray(workingData[field])) {
            if (field === 'resource_plans') {
                console.log(`   📋 Resource plans comparison:`);
                console.log(`      Failing: ${JSON.stringify(failingData[field])}`);
                console.log(`      Working: ${JSON.stringify(workingData[field])}`);

                // Check if failing resource_plans have features
                const failingPlans = failingData[field];
                const hasFeatures = failingPlans.every(plan => 'features' in plan);
                if (!hasFeatures) {
                    console.log(`   ❌ ISSUE: resource_plans missing 'features' array`);
                }
            }
        }

    } else if (inFailing && !inWorking) {
        console.log(`⚠️  ${field}: Only in failing (extra field)`);

        // Check if this extra field might cause issues
        if (['startTime', 'endTime', 'location_id'].includes(field)) {
            console.log(`   ⚠️  Potentially problematic field: ${field}`);
        }
    } else if (!inFailing && inWorking) {
        console.log(`⚠️  ${field}: Only in working (missing field)`);
    }
});

console.log('\n=== SPECIFIC ISSUE ANALYSIS ===');

// Check resource_plans structure
if (failingData.resource_plans) {
    console.log('Failing resource_plans structure:');
    failingData.resource_plans.forEach((plan, index) => {
        console.log(`  Plan ${index + 1}:`, Object.keys(plan));
        if (!plan.features) {
            console.log(`    ❌ Missing 'features' array in plan ${index + 1}`);
        }
    });
}

// Check for problematic fields
const problematicFields = ['startTime', 'endTime', 'location_id'];
problematicFields.forEach(field => {
    if (failingData[field]) {
        console.log(`⚠️  Found potentially problematic field '${field}': ${failingData[field]}`);
    }
});

// Check location_id specifically
if (failingData.location_id === "loc_12345") {
    console.log('❌ POTENTIAL ISSUE: location_id "loc_12345" might not exist in the system');
}

console.log('\n=== RECOMMENDATIONS ===');
console.log('1. Add "features" array to each resource_plan');
console.log('2. Remove or set location_id to null if location doesn\'t exist');
console.log('3. Consider removing startTime/endTime if not needed');
console.log('4. Ensure all referenced IDs exist in the system');