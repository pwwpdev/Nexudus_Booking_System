const { Limitations } = require('../Limitations/createLimitationResouce');

describe('Limitations Function - Integration Tests', () => {
    const baseCustomDates = {
        start_date: '2024-01-01',
        end_date: '2024-12-31'
    };

    const baseStartTime = '2024-01-01T09:00:00Z';
    const baseEndTime = '2024-01-01T17:00:00Z';
    const baseCapacity = 10;

    test('should throw error with empty slots array', async () => {
        // Arrange
        const emptySlots = [];

        // Act & Assert
        await expect(
            Limitations(baseCustomDates, baseStartTime, baseEndTime, baseCapacity, emptySlots)
        ).rejects.toThrow();
    }, 10000);
});
