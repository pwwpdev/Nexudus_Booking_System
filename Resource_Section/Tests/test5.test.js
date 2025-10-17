const { Limitations } = require('../Limitations/createLimitationResouce');

describe('Limitations Function - Integration Tests', () => {
    const baseCustomDates = {
        start_date: '2024-01-01',
        end_date: '2024-12-31'
    };

    const baseStartTime = '2024-01-01T09:00:00Z';
    const baseEndTime = '2024-01-01T17:00:00Z';
    const baseCapacity = 10;

    test('should work with different date ranges', async () => {
        // Arrange
        const slots = [{ starts_at: '2024-01-01T10:00:00Z', ends_at: '2024-01-01T11:00:00Z' }];
        const shortDateRange = {
            start_date: '2024-01-01',
            end_date: '2024-01-31'
        };

        const longDateRange = {
            start_date: '2024-01-01',
            end_date: '2024-12-31'
        };

        // Act & Assert
        const resourceId1 = await Limitations(shortDateRange, baseStartTime, baseEndTime, baseCapacity, slots);
        const resourceId2 = await Limitations(longDateRange, baseStartTime, baseEndTime, baseCapacity, slots);

        expect(resourceId1).toBeDefined();
        expect(resourceId2).toBeDefined();
    },10000);
});
