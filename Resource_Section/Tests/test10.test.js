const { Limitations } = require('../Limitations/createLimitationResouce');

describe('Limitations Function - Integration Tests', () => {
    const baseCustomDates = {
        start_date: '2024-01-01',
        end_date: '2024-12-31'
    };

    const baseStartTime = '2024-01-01T09:00:00Z';
    const baseEndTime = '2024-01-01T17:00:00Z';
    const baseCapacity = 10;

    test('should throw error with invalid date format', async () => {
        // Arrange
        const slots = [{ starts_at: '2024-01-01T10:00:00Z', ends_at: '2024-01-01T11:00:00Z' }];
        const invalidDates = {
            start_date: 'invalid-date',
            end_date: '2024-12-31'
        };

        // Act & Assert
        await expect(
            Limitations(invalidDates, baseStartTime, baseEndTime, baseCapacity, slots)
        ).rejects.toThrow();
    },10000);
});
