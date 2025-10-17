const { apiClient } = require('../../apiClient');

/**
 * Get schedule block by weekday for a specific recurring schedule
 * @param {string} resource_id - The ID of the resource
 * @param {string} recurring_schedule_id - The ID of the recurring schedule
 * @param {string} weekday - The weekday (e.g., 'monday', 'tuesday', etc.)
 * @returns {Object} Schedule block object for the specified weekday
 */
async function getScheduleBlockByWeekday(resource_id, recurring_schedule_id, weekday) {
    try {
        const response = await apiClient.get(`/resources/${resource_id}/recurring-schedules/${recurring_schedule_id}/schedule-blocks`);

        if (!response.data || !response.data.data || response.data.data.length === 0) {
            throw new Error(`No schedule blocks found for recurring schedule ID: ${recurring_schedule_id}`);
        }

        // Filter by weekday (case-insensitive)
        const scheduleBlock = response.data.data.find(block =>
            block.weekday.toLowerCase() === weekday.toLowerCase()
        );

        if (!scheduleBlock) {
            throw new Error(`No schedule block found for weekday: ${weekday}`);
        }

        console.log(`Found schedule block for ${weekday}: ${scheduleBlock.id}`);

        console.log(scheduleBlock);

        return {
            id: scheduleBlock.id,
            recurring_schedule_id: scheduleBlock.recurring_schedule_id,
            weekday: scheduleBlock.weekday,
            start_time: scheduleBlock.start_time,
            end_time: scheduleBlock.end_time,
            created_at: scheduleBlock.created_at,
            updated_at: scheduleBlock.updated_at
        };
    } catch (err) {
        console.log("Error while getting schedule block by weekday:", err.message ? err.message : err);
        throw err;
    }
}

module.exports = { getScheduleBlockByWeekday };