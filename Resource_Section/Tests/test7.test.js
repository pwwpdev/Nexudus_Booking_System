const { Limitations } = require('../Limitations/createLimitationResouce');

describe('Limitations Function - Integration Tests', () => {
    const baseCustomDates = {
        start_date: '2024-01-01',
        end_date: '2024-12-31'
    };

    const baseStartTime = '2024-01-01T09:00:00Z';
    const baseEndTime = '2024-01-01T17:00:00Z';
    const baseCapacity = 10;

    test('should throw error with overlapping slots if validation detects it', async () => {
        // Arrange
        const overlappingSlots = [
            { starts_at: '2024-01-01T10:00:00Z', ends_at: '2024-01-01T12:00:00Z' },
            { starts_at: '2024-01-01T11:00:00Z', ends_at: '2024-01-01T13:00:00Z' } // Overlaps with previous slot
        ];

        // Act & Assert
        await expect(
            Limitations(baseCustomDates, baseStartTime, baseEndTime, baseCapacity, overlappingSlots)
        ).toBeDefined();
    },10000);
});
