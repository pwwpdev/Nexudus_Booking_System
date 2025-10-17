const { getResourceByName } = require('./getResourceByName');
const { getRecurringScheduleByResource } = require('../RecurringSchedule/getRecurringScheduleByResource');
const { getScheduleBlockByWeekday } = require('../RecurringSchedule/getScheduleBlockByWeekday');
const { getScheduleBlocksByWeekday } = require('../RecurringSchedule/getScheduleBlocksByWeekday');

/**
 * Get complete resource schedule information from resource name and weekday
 * @param {string} resource_name - The name of the resource
 * @param {string} weekday - The weekday to get schedule block for (optional)
 * @returns {Object} Complete resource schedule information
 */
async function getResourceScheduleInfo(resource_name, weekday = null) {
    try {
        // Step 1: Get resource by name
        const resource = await getResourceByName(resource_name);

        // Step 2: Get recurring schedule for the resource
        const recurringSchedule = await getRecurringScheduleByResource(resource.id);

        let scheduleBlock = null;

        // Step 3: Get schedule block by weekday if weekday is provided
        if (weekday) {
            scheduleBlock = await getScheduleBlockByWeekday(
                resource.id,
                recurringSchedule.id,
                weekday
            );
        }

        const result = {
            resource: resource,
            recurring_schedule: recurringSchedule,
            schedule_block: scheduleBlock
        };

        console.log(`Successfully retrieved schedule info for resource: ${resource_name}${weekday ? ` on ${weekday}` : ''}`);

        return result;
    } catch (err) {
        console.log("Error while getting resource schedule info:", err.message ? err.message : err);
        throw err;
    }
}

/**
 * Get all schedule blocks for a resource
 * @param {string} resource_name - The name of the resource
 * @returns {Object} Resource with all its schedule blocks
 */
async function getAllResourceScheduleBlocks(resource_name) {
    try {
        // Get resource and recurring schedule
        const resource = await getResourceByName(resource_name);
        const recurringSchedule = await getRecurringScheduleByResource(resource.id);

        // Get schedule blocks organized by weekday
        const weekdaySchedule = await getScheduleBlocksByWeekday(resource.id, recurringSchedule.id);

        return {
            resource: resource,
            recurring_schedule: recurringSchedule,
            schedule_blocks_by_weekday: weekdaySchedule
        };
    } catch (err) {
        console.log("Error while getting all resource schedule blocks:", err.message ? err.message : err);
        throw err;
    }
}

/**
 * Get resource schedule with weekday organization (alternative function name for clarity)
 * @param {string} resource_name - The name of the resource
 * @returns {Object} Resource with schedule blocks organized by weekday
 */
async function getResourceWeeklySchedule(resource_name) {
    return await getAllResourceScheduleBlocks(resource_name);
}

module.exports = {
    getResourceScheduleInfo,
    getAllResourceScheduleBlocks,
    getResourceWeeklySchedule
};