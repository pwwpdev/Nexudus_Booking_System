const { apiClient } = require('../../apiClient');

/**
 * Get all schedule blocks for a resource organized by weekday
 * @param {string} resource_id - The ID of the resource
 * @param {string} recurring_schedule_id - The ID of the recurring schedule
 * @returns {Object} Schedule blocks organized by weekday {monday: {}, tuesday: {}, ...}
 */
async function getScheduleBlocksByWeekday(resource_id, recurring_schedule_id) {
    try {
        const response = await apiClient.get(`/resources/${resource_id}/recurring-schedules/${recurring_schedule_id}/schedule-blocks`);

        if (!response.data || !response.data.data) {
            throw new Error(`No schedule blocks found for recurring schedule ID: ${recurring_schedule_id}`);
        }

        const scheduleBlocks = response.data.data;
        console.log(`Found ${scheduleBlocks.length} schedule blocks for resource: ${resource_id}`);

        // Initialize weekday object with all days
        const weekdaySchedule = {
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null,
            saturday: null,
            sunday: null
        };

        // Organize schedule blocks by weekday
        scheduleBlocks.forEach(block => {
            const weekday = block.weekday.toLowerCase();
            weekdaySchedule[weekday] = {
                id: block.id,
                recurring_schedule_id: block.recurring_schedule_id,
                weekday: block.weekday,
                start_time: block.start_time,
                end_time: block.end_time,
                created_at: block.created_at,
                updated_at: block.updated_at
            };
        });

        console.log('Schedule blocks organized by weekday:', Object.keys(weekdaySchedule).filter(day => weekdaySchedule[day] !== null));

        return weekdaySchedule;
    } catch (err) {
        console.log("Error while getting schedule blocks by weekday:", err.message ? err.message : err);
        throw err;
    }
}

module.exports = { getScheduleBlocksByWeekday };