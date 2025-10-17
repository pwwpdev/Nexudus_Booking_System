const { getResourceByName } = require('../Resource/getResourceByName');
const { getRecurringScheduleByResource } = require('./getRecurringScheduleByResource');
const { getScheduleBlockByWeekday } = require('./getScheduleBlockByWeekday');

/**
 * Get schedule block ID by resource name and weekday
 * @param {string} resource_name - The name of the resource
 * @param {string} weekday - The weekday (e.g., 'monday', 'tuesday', etc.)
 * @returns {string} Schedule block ID
 */
async function getScheduleBlockIdByResourcename(resource_name, weekday) {
    try {
        console.log(`Getting schedule block ID for resource: ${resource_name} on ${weekday}`);

        // Step 1: Get resource by name
        const resource = await getResourceByName(resource_name);

        // Step 2: Get recurring schedule for the resource
        const recurringSchedule = await getRecurringScheduleByResource(resource.id);

        // Step 3: Get schedule block by weekday
        const scheduleBlock = await getScheduleBlockByWeekday(
            resource.id,
            recurringSchedule.id,
            weekday
        );

        console.log(`Found schedule block ID: ${scheduleBlock.id} for ${resource_name} on ${weekday}`);

        return scheduleBlock.id;
    } catch (err) {
        console.log("Error while getting schedule block ID by resource name and weekday:", err.message ? err.message : err);
        throw err;
    }
}

module.exports = { getScheduleBlockIdByResourcename };