const { Limitations } = require('../Limitations/createLimitationResouce');

describe('Limitations Function - Integration Tests', () => {
    const baseCustomDates = {
        start_date: '2024-01-01',
        end_date: '2024-12-31'
    };

    const baseStartTime = '2024-01-01T09:00:00Z';
    const baseEndTime = '2024-01-01T17:00:00Z';
    const baseCapacity = 10;

    test('should throw error with invalid slot format', async () => {
        // Arrange
        const invalidFormatSlots = [
            { starts_at: '25:00:00', ends_at: '26:00:00' } // Invalid time
        ];

        // Act & Assert
        await expect(
            Limitations(baseCustomDates, baseStartTime, baseEndTime, baseCapacity, invalidFormatSlots)
        ).rejects.toThrow();
    },10000);
});
