const { Limitations } = require('../Limitations/createLimitationResouce');

describe('Limitations Function - Integration Tests', () => {
    const baseCustomDates = {
        start_date: '2024-01-01',
        end_date: '2024-12-31'
    };

    const baseStartTime = '2024-01-01T09:00:00Z';
    const baseEndTime = '2024-01-01T17:00:00Z';
    const baseCapacity = 10;

    test('should handle multiple small slots', async () => {
        // Arrange
        const smallSlots = [
            { starts_at: '2024-01-01T09:00:00Z', ends_at: '2024-01-01T09:30:00Z' },
            { starts_at: '2024-01-01T09:30:00Z', ends_at: '2024-01-01T10:00:00Z' },
            { starts_at: '2024-01-01T10:00:00Z', ends_at: '2024-01-01T10:30:00Z' },
            { starts_at: '2024-01-01T10:30:00Z', ends_at: '2024-01-01T11:00:00Z' },
            { starts_at: '2024-01-01T11:00:00Z', ends_at: '2024-01-01T11:30:00Z' }
        ];

        // Act
        const resourceId = await Limitations(
            baseCustomDates,
            baseStartTime,
            baseEndTime,
            baseCapacity,
            smallSlots
        );

        // Assert
        expect(resourceId).toBeDefined();
    },10000);
});
