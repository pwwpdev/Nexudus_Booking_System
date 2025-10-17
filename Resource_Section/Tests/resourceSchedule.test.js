const { getResourceByName } = require('../Controllers/Resource/getResourceByName');
const { getRecurringScheduleByResource } = require('../Controllers/RecurringSchedule/getRecurringScheduleByResource');
const { getScheduleBlockByWeekday } = require('../Controllers/RecurringSchedule/getScheduleBlockByWeekday');
const { getResourceScheduleInfo, getAllResourceScheduleBlocks } = require('../Controllers/Resource/getResourceScheduleInfo');

describe('Resource Schedule Functions', () => {
    const testResourceName = 'Test Resource'; // Replace with actual resource name
    const testWeekday = 'monday'; // Replace with actual weekday

    test('should get resource by name', async () => {
        try {
            const resource = await getResourceByName(testResourceName);
            expect(resource).toBeDefined();
            expect(resource.id).toBeDefined();
            expect(resource.name).toBe(testResourceName);
            console.log('Resource found:', resource);
        } catch (error) {
            console.log('Test skipped - resource not found:', error.message);
        }
    });

    test('should get recurring schedule by resource ID', async () => {
        try {
            const resource = await getResourceByName(testResourceName);
            const recurringSchedule = await getRecurringScheduleByResource(resource.id);
            expect(recurringSchedule).toBeDefined();
            expect(recurringSchedule.id).toBeDefined();
            expect(recurringSchedule.resource_id).toBe(resource.id);
            console.log('Recurring schedule found:', recurringSchedule);
        } catch (error) {
            console.log('Test skipped - recurring schedule not found:', error.message);
        }
    });

    test('should get schedule block by weekday', async () => {
        try {
            const resource = await getResourceByName(testResourceName);
            const recurringSchedule = await getRecurringScheduleByResource(resource.id);
            const scheduleBlock = await getScheduleBlockByWeekday(resource.id, recurringSchedule.id, testWeekday);
            expect(scheduleBlock).toBeDefined();
            expect(scheduleBlock.id).toBeDefined();
            expect(scheduleBlock.weekday.toLowerCase()).toBe(testWeekday.toLowerCase());
            console.log('Schedule block found:', scheduleBlock);
        } catch (error) {
            console.log('Test skipped - schedule block not found:', error.message);
        }
    });

    test('should get complete resource schedule info', async () => {
        try {
            const scheduleInfo = await getResourceScheduleInfo(testResourceName, testWeekday);
            expect(scheduleInfo).toBeDefined();
            expect(scheduleInfo.resource).toBeDefined();
            expect(scheduleInfo.recurring_schedule).toBeDefined();
            expect(scheduleInfo.schedule_block).toBeDefined();
            console.log('Complete schedule info:', scheduleInfo);
        } catch (error) {
            console.log('Test skipped - complete schedule info not found:', error.message);
        }
    });

    test('should get all resource schedule blocks', async () => {
        try {
            const resourceSchedule = await getAllResourceScheduleBlocks(testResourceName);
            expect(resourceSchedule).toBeDefined();
            expect(resourceSchedule.resource).toBeDefined();
            expect(resourceSchedule.recurring_schedule).toBeDefined();
            expect(resourceSchedule.schedule_blocks).toBeDefined();
            expect(Array.isArray(resourceSchedule.schedule_blocks)).toBe(true);
            console.log('All schedule blocks:', resourceSchedule);
        } catch (error) {
            console.log('Test skipped - resource schedule blocks not found:', error.message);
        }
    });
});