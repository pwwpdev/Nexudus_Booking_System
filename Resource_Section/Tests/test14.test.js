const { Limitations } = require('../Limitations/createLimitationResouce');

describe('Limitations Function - Integration Tests', () => {
    const baseCustomDates = {
        start_date: '2024-01-01',
        end_date: '2024-12-31'
    };

    const baseStartTime = '2024-01-01T09:00:00Z';
    const baseEndTime = '2024-01-01T17:00:00Z';
    const baseCapacity = 10;

    test('should handle slots that exactly match start and end times', async () => {
        // Arrange
        const exactSlots = [
            { starts_at: '2024-01-01T09:00:00Z', ends_at: '2024-01-01T17:00:00Z' }
        ];

        // Act
        const resourceId = await Limitations(
            baseCustomDates,
            baseStartTime,
            baseEndTime,
            baseCapacity,
            exactSlots
        );

        // Assert
        expect(resourceId).toBeDefined();
    },10000);
});
