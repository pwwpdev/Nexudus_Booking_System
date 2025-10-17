const { Limitations } = require('../Limitations/createLimitationResouce');

describe('Limitations Function - Integration Tests', () => {
    const baseCustomDates = {
        start_date: '2024-01-01',
        end_date: '2024-12-31'
    };

    const baseStartTime = '2024-01-01T09:00:00Z';
    const baseEndTime = '2024-01-01T17:00:00Z';
    const baseCapacity = 10;

    test('should throw error when slots are outside general timings', async () => {
        // Arrange
        const invalidSlots = [
            { starts_at: '2024-01-01T08:00:00Z', ends_at: '2024-01-01T09:00:00Z' }, // Before start time
            { starts_at: '2024-01-01T17:00:00Z', ends_at: '2024-01-01T18:00:00Z' }  // After end time
        ];

        // Act & Assert
        await expect(
            Limitations(baseCustomDates, baseStartTime, baseEndTime, baseCapacity, invalidSlots)
        ).rejects.toThrow('Slot 1 start time (2024-01-01T08:00:00Z) is outside the allowed range (2024-01-01T09:00:00Z - 2024-01-01T17:00:00Z)');
    },10000);
});
