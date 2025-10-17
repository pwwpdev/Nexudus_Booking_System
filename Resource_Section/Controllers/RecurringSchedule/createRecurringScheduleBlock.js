
const {apiClient} = require('../../apiClient');


async function createRecurringScheduleBlock(resourceId, recurringScheduleId, weekday, startTime, endTime) {
  try {
    console.log("Creating schedule block with:", { resourceId, recurringScheduleId, weekday, startTime, endTime });
    const scheduleBlock = await apiClient.post(
      `resources/${resourceId}/recurring-schedules/${recurringScheduleId}/schedule-blocks`,
      {
        "weekday": `${weekday}`,
        "start_time": startTime,
        "end_time": endTime
      }
    );
    return scheduleBlock;
  } catch (err) {
    console.log("There is an error while creating the schedule block ", err.message ? err.message : err);
    throw err;
  }
}

module.exports = { createRecurringScheduleBlock };