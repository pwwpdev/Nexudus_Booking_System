const { apiClient } = require('../apiClient');
const { getResourceByName } = require('../Controllers/Resource/getResourceByName');
const { getRecurringScheduleByResource } = require('../Controllers/RecurringSchedule/getRecurringScheduleByResource');
const { getScheduleBlockIdByResourcename } = require('../Controllers/RecurringSchedule/getScheduleBlockIdByResourcename');

async function updateRecurringScheduleBlock(resource_name, weekday, startTime, endTime) {
    try {
        console.log(`Updating schedule block for resource: ${resource_name} on ${weekday}`);

        // Get resource by name
        const resource = await getResourceByName(resource_name);

        // Get recurring schedule for the resource
        const recurringSchedule = await getRecurringScheduleByResource(resource.id);

        // Get schedule block ID by weekday
        const scheduleBlockId = await getScheduleBlockIdByResourcename(resource_name, weekday);

        const response = await apiClient.patch(`resources/${resource.id}/recurring-schedules/${recurringSchedule.id}/schedule-blocks/${scheduleBlockId}`, {
            "weekday": `${weekday}`,
            "start_time": startTime,
            "end_time": endTime
        });

        console.log("Recurring schedule block updated successfully", response.data);
        return response;
    } catch (err) {
        console.log("Error while updating recurring schedule block:", err.message ? err.message : err);
        throw err;
    }
}

module.exports = { updateRecurringScheduleBlock };
    