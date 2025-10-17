const { Limitations } = require('../Limitations/createLimitationResouce');

describe('Limitations Function - Integration Tests', () => {
    
    // Common test data
    const baseCustomDates = {
        start_date: '2024-01-01',
        end_date: '2024-12-31'
    };
    
    const baseStartTime = '2024-01-01T09:00:00Z';
    const baseEndTime = '2024-01-01T17:00:00Z';
    const baseCapacity = 10;

    // Positive Test Cases
    describe('Positive Test Cases', () => {
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
        });

        test('should work with single slot', async () => {
            // Arrange
            const singleSlot = [
                { starts_at: '2024-01-01T10:00:00Z', ends_at: '2024-01-01T12:00:00Z' }
            ];

            // Act
            const resourceId = await Limitations(
                baseCustomDates, 
                baseStartTime, 
                baseEndTime, 
                5, 
                singleSlot
            );

            // Assert
            expect(resourceId).toBeDefined();
        });

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
        });

        test('should work with different capacity values', async () => {
            // Arrange
            const slots = [{ starts_at: '2024-01-01T10:00:00Z', ends_at: '2024-01-01T11:00:00Z' }];
            
            // Test with capacity = 1
            const resourceId1 = await Limitations(
                baseCustomDates, baseStartTime, baseEndTime, 1, slots
            );
            expect(resourceId1).toBeDefined();

            // Test with capacity = 100
            // const resourceId2 = await Limitations(
            //     baseCustomDates, baseStartTime, baseEndTime, 100, slots
            // );
            // expect(resourceId2).toBeDefined();
        });

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
        });
    });

    // Negative Test Cases - Error Scenarios
    describe('Negative Test Cases', () => {
        test('should throw error when slots are outside general timings', async () => {
            // Arrange
            const invalidSlots = [
                { starts_at: '2024-01-01T08:00:00Z', ends_at: '2024-01-01T09:00:00Z' }, // Before start time
                { starts_at: '2024-01-01T17:00:00Z', ends_at: '2024-01-01T18:00:00Z' }  // After end time
            ];

            // Act & Assert
            await expect(
                Limitations(baseCustomDates, baseStartTime, baseEndTime, baseCapacity, invalidSlots)
            ).rejects.toThrow('please verify the slots with the resource general timings available');
        });

        test('should throw error with overlapping slots if validation detects it', async () => {
            // Arrange
            const overlappingSlots = [
                { starts_at: '2024-01-01T10:00:00Z', ends_at: '2024-01-01T12:00:00Z' },
                { starts_at: '2024-01-01T11:00:00Z', ends_at: '2024-01-01T13:00:00Z' } // Overlaps with previous slot
            ];

            // Act & Assert
            await expect(
                Limitations(baseCustomDates, baseStartTime, baseEndTime, baseCapacity, overlappingSlots)
            ).rejects.toThrow();
        });

        test('should throw error with invalid slot format', async () => {
            // Arrange
            const invalidFormatSlots = [
                { starts_at: '25:00:00', ends_at: '26:00:00' } // Invalid time
            ];

            // Act & Assert
            await expect(
                Limitations(baseCustomDates, baseStartTime, baseEndTime, baseCapacity, invalidFormatSlots)
            ).rejects.toThrow();
        });

        test('should throw error with empty slots array', async () => {
            // Arrange
            const emptySlots = [];

            // Act & Assert
            await expect(
                Limitations(baseCustomDates, baseStartTime, baseEndTime, baseCapacity, emptySlots)
            ).rejects.toThrow();
        });

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
        });

        test('should throw error with end date before start date', async () => {
            // Arrange
            const slots = [{ starts_at: '2024-01-01T10:00:00Z', ends_at: '2024-01-01T11:00:00Z' }];
            const invalidDates = {
                start_date: '2024-12-31',
                end_date: '2024-01-01'
            };

            // Act & Assert
            await expect(
                Limitations(invalidDates, baseStartTime, baseEndTime, baseCapacity, slots)
            ).rejects.toThrow();
        });

        test('should throw error with zero or negative capacity', async () => {
            // Arrange
            const slots = [{ starts_at: '2024-01-01T10:00:00Z', ends_at: '2024-01-01T11:00:00Z' }];

            // Act & Assert
            await expect(
                Limitations(baseCustomDates, baseStartTime, baseEndTime, 0, slots)
            ).rejects.toThrow();

            await expect(
                Limitations(baseCustomDates, baseStartTime, baseEndTime, -5, slots)
            ).rejects.toThrow();
        });

        test('should throw error with invalid time format', async () => {
            // Arrange
            const slots = [{ starts_at: '2024-01-01T10:00:00Z', ends_at: '2024-01-01T11:00:00Z' }];

            // Act & Assert
            await expect(
                Limitations(baseCustomDates, '25:00:00', baseEndTime, baseCapacity, slots)
            ).rejects.toThrow();

            await expect(
                Limitations(baseCustomDates, baseStartTime, 'invalid-time', baseCapacity, slots)
            ).rejects.toThrow();
        });
    });

    // Edge Cases
    describe('Edge Cases', () => {
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
        });

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
        });

        test('should handle very large capacity values', async () => {
            // Arrange
            const slots = [{ starts_at: '2024-01-01T10:00:00Z', ends_at: '2024-01-01T11:00:00Z' }];
            const largeCapacity = 1000000;

            // Act
            const resourceId = await Limitations(
                baseCustomDates, 
                baseStartTime, 
                baseEndTime, 
                largeCapacity, 
                slots
            );

            // Assert
            expect(resourceId).toBeDefined();
        });
    });
});