const { Limitations } = require('../Limitations/createLimitationResouce');

describe('Limitations Function - Integration Tests', () => {
    const baseCustomDates = {
        start_date: '2024-01-01',
        end_date: '2024-12-31'
    };

    const baseStartTime = '2024-01-01T09:00:00Z';
    const baseEndTime = '2024-01-01T17:00:00Z';
    const baseCapacity = 10;

    test('should work with different capacity values', async () => {
        // Arrange
        const slots = [{ starts_at: '2024-01-01T10:00:00Z', ends_at: '2024-01-01T11:00:00Z' }];

        // Test with capacity = 1
        const resourceId1 = await Limitations(
            baseCustomDates, baseStartTime, baseEndTime, 1, slots
        );
        expect(resourceId1).toBeDefined();

        // Test with capacity = 100
        const resourceId2 = await Limitations(
            baseCustomDates, baseStartTime, baseEndTime, 100, slots
        );
        expect(resourceId2).toBeDefined();
    },10000);
});
