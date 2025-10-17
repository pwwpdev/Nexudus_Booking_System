const { Limitations } = require('../Limitations/createLimitationResouce');

describe('Limitations Function - Integration Tests', () => {
    const baseCustomDates = {
        start_date: '2024-01-01',
        end_date: '2024-12-31'
    };

    const baseStartTime = '2024-01-01T09:00:00Z';
    const baseEndTime = '2024-01-01T17:00:00Z';
    const baseCapacity = 10;

    test('should create resource with valid slots and return resource ID', async () => {
        // Arrange
        const validSlots = [
            { starts_at: '2024-01-01T09:00:00Z', ends_at: '2024-01-01T10:00:00Z' },
            { starts_at: '2024-01-01T11:00:00Z', ends_at: '2024-01-01T12:00:00Z' },
            { starts_at: '2024-01-01T14:00:00Z', ends_at: '2024-01-01T15:00:00Z' }
        ];

        // Act
        const resourceId = await Limitations(
            baseCustomDates,
            baseStartTime,
            baseEndTime,
            baseCapacity,
            validSlots
        );

        // Assert
        expect(resourceId).toBeDefined();
        expect(typeof resourceId).toBe('string');
        expect(resourceId.length).toBeGreaterThan(0);
    }, 10000);
});
