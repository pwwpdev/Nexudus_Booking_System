const { updateRecurringScheduleBlock } = require('./updateRecurringScheduleBlock');

async function updateBulkRecurringScheduleBlock(resource_id, recurringSchedule_id, scheduleBlocks) {
    try {
        const results = [];

        for (const block of scheduleBlocks) {
            const { weekday, startTime, endTime } = block;

            try {
                const result = await updateRecurringScheduleBlock(
                    resource_id,
                    recurringSchedule_id,
                    weekday,
                    startTime,
                    endTime
                );
                results.push({ success: true, weekday, result: result.data });
            } catch (error) {
                console.log(`Failed to update schedule block for weekday ${weekday}:`, error.message);
                results.push({ success: false, weekday, error: error.message });
            }
        }

        console.log("Bulk recurring schedule block update completed", results);
        return results;
    } catch (err) {
        console.log("Error in bulk update recurring schedule blocks:", err.message ? err.message : err);
        throw err;
    }
}

module.exports = { updateBulkRecurringScheduleBlock };
