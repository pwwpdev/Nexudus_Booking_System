const { Limitations } = require('../Limitations/createLimitationResouce');

describe('Limitations Function - Integration Tests', () => {
    const baseCustomDates = {
        start_date: '2024-01-01',
        end_date: '2024-12-31'
    };

    const baseStartTime = '2024-01-01T09:00:00Z';
    const baseEndTime = '2024-01-01T17:00:00Z';
    const baseCapacity = 10;

    test('should work with consecutive slots covering entire time range', async () => {
        // Arrange
        const consecutiveSlots = [
            { starts_at: '2024-01-01T09:00:00Z', ends_at: '2024-01-01T12:00:00Z' },
            { starts_at: '2024-01-01T12:00:00Z', ends_at: '2024-01-01T15:00:00Z' },
            { starts_at: '2024-01-01T15:00:00Z', ends_at: '2024-01-01T17:00:00Z' }
        ];

        // Act
        const resourceId = await Limitations(
            baseCustomDates,
            baseStartTime,
            baseEndTime,
            baseCapacity,
            consecutiveSlots
        );

        // Assert
        expect(resourceId).toBeDefined();
    },10000);
});
