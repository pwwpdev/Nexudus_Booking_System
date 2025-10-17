# HAPIO API Documentation

## Base URL
```
http://localhost:3000
```

## Table of Contents
1. [Health & Status Endpoints](#health--status-endpoints)
2. [Resource Management](#resource-management)
3. [Schedule Management](#schedule-management)
4. [Rate Management](#rate-management)

---

## Health & Status Endpoints

### 1. Health Check
**GET** `/health`

**Description:** Check server health and status

**Parameters:** None

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 3600.123,
  "memory": {
    "rss": 50331648,
    "heapTotal": 20971520,
    "heapUsed": 15728640,
    "external": 1048576
  },
  "pid": 12345
}
```

### 2. Root Endpoint
**GET** `/`

**Description:** Basic API information

**Parameters:** None

**Response:**
```json
{
  "message": "HAPIO API Server",
  "version": "1.0.0",
  "status": "running"
}
```

---

## Resource Management

### 3. Create Resource
**POST** `/createResource`

**Description:** Create a new resource with scheduling, rates, and metadata

**Request Body:**
```json
{
  "price": 50.00,
  "defined_timings": [
    {
      "weekday": "monday",
      "start_time": "09:00:00",
      "end_time": "17:00:00"
    },
    {
      "weekday": "tuesday", 
      "start_time": "09:00:00",
      "end_time": "17:00:00"
    }
  ],
  "max_duration": 120,
  "min_duration": 30,
  "duration_interval": 15,
  "resource_name": "Conference Room A",
  "start_date": "2025-01-01",
  "startTime": "09:00:00",
  "endTime": "17:00:00",
  "photo_url": "https://example.com/images/room.jpg",
  "capacity": 10,
  "resource_details": {
    "description": "Large conference room with modern amenities",
    "floor": 2,
    "building": "Main Office"
  },
  "email_confirmation": true,
  "resource_plans": [
    {
      "plan_name": "Standard",
      "features": ["WiFi", "Projector", "Whiteboard"]
    },
    {
      "plan_name": "Premium",
      "features": ["WiFi", "Projector", "Whiteboard", "Video Conference", "Catering"]
    }
  ],
  "category": "meeting_room",
  "location_id": "loc_12345",
  "metadata": {
    "equipment": ["projector", "whiteboard", "conference_phone"],
    "accessibility": true
  },
  "rates": [
    {
      "price_name": "Standard Hourly Rate",
      "description": "Basic hourly rate for conference room usage",
      "price": 50,
      "renewal_type": "every hour"
    },
    {
      "price_name": "Daily Package",
      "description": "Full day access with all amenities included",
      "price": 300,
      "renewal_type": "every day"
    }
  ]
}
```

**Required Fields:**
- `resource_name` (string)
- `defined_timings` (array)
- `max_duration` (number)
- `min_duration` (number)
- `duration_interval` (number)
- `start_date` (string, YYYY-MM-DD format)
- `capacity` (number)
- `category` (string)

**Optional Fields:**
- `price` (number)
- `photo_url` (string)
- `resource_details` (object)
- `email_confirmation` (boolean)
- `resource_plans` (array)
- `location_id` (string)
- `metadata` (object)
- `rates` (array)

**Rate Object Structure:**
- `price_name` (string, required)
- `description` (string, required)
- `price` (number, required, positive)
- `renewal_type` (enum, required): `"every month"`, `"every week"`, `"every day"`, `"every hour"`, `"every use"`

**Response:**
```json
{
  "message": "Resource created successfully",
  "resource_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 4. View All Resources
**GET** `/viewAllresources`

**Description:** Get all resources in the system

**Parameters:** None

**Response:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Conference Room A",
      "max_simultaneous_bookings": 1,
      "metadata": {
        "capacity": 10,
        "category": "meeting_room",
        "rates": [...]
      },
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### 5. View Resource by Name
**GET** `/viewResource/:resource_name`

**Description:** Get detailed resource information by name (returns full API response)

**Parameters:**
- `resource_name` (path parameter): Name of the resource

**Example:**
```
GET /viewResource/Conference%20Room%20A
```

**Response:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Conference Room A",
      "max_simultaneous_bookings": 1,
      "metadata": {
        "capacity": 10,
        "category": "meeting_room",
        "photo_url": "https://example.com/images/room.jpg",
        "rates": [
          {
            "price_name": "Standard Hourly Rate",
            "description": "Basic hourly rate for conference room usage",
            "price": 50,
            "renewal_type": "every hour",
            "created_at": "2025-01-01T00:00:00Z"
          }
        ]
      }
    }
  ]
}
```

### 6. Get Resource by Name (Processed)
**GET** `/getResourceByName/:resource_name`

**Description:** Get processed resource object with clean structure

**Parameters:**
- `resource_name` (path parameter): Name of the resource

**Example:**
```
GET /getResourceByName/Conference%20Room%20A
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Conference Room A",
  "location_id": "loc_12345",
  "category": "meeting_room",
  "capacity": 10,
  "metadata": {
    "rates": [...],
    "photo_url": "https://example.com/images/room.jpg"
  },
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

### 7. Delete Resource
**DELETE** `/deleteResource/:resource_id`

**Description:** Delete a resource by ID

**Parameters:**
- `resource_id` (path parameter): UUID of the resource

**Example:**
```
DELETE /deleteResource/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "message": "Resource deleted successfully"
}
```

---

## Schedule Management

### 8. Get Recurring Schedule by Resource ID
**GET** `/getRecurringSchedule/:resource_id`

**Description:** Get recurring schedule information for a resource

**Parameters:**
- `resource_id` (path parameter): UUID of the resource

**Example:**
```
GET /getRecurringSchedule/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "id": "schedule_123",
  "resource_id": "550e8400-e29b-41d4-a716-446655440000",
  "location_id": "loc_12345",
  "start_date": "2025-01-01",
  "end_date": null,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

### 9. Get Schedule Block by IDs and Weekday
**GET** `/getScheduleBlock/:resource_id/:recurring_schedule_id/:weekday`

**Description:** Get specific schedule block using resource ID, recurring schedule ID, and weekday

**Parameters:**
- `resource_id` (path parameter): UUID of the resource
- `recurring_schedule_id` (path parameter): UUID of the recurring schedule
- `weekday` (path parameter): Day of the week (monday, tuesday, etc.)

**Example:**
```
GET /getScheduleBlock/550e8400-e29b-41d4-a716-446655440000/schedule_123/monday
```

**Response:**
```json
{
  "id": "block_456",
  "recurring_schedule_id": "schedule_123",
  "weekday": "monday",
  "start_time": "09:00:00",
  "end_time": "17:00:00",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

### 10. Get Complete Resource Schedule Info
**GET** `/getResourceScheduleInfo/:resource_name`

**Description:** Get complete resource information including schedule details

**Parameters:**
- `resource_name` (path parameter): Name of the resource
- `weekday` (query parameter, optional): Specific weekday to get schedule block for

**Examples:**
```
GET /getResourceScheduleInfo/Conference%20Room%20A
GET /getResourceScheduleInfo/Conference%20Room%20A?weekday=monday
```

**Response:**
```json
{
  "resource": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Conference Room A",
    "location_id": "loc_12345",
    "category": "meeting_room",
    "capacity": 10,
    "metadata": {...}
  },
  "recurring_schedule": {
    "id": "schedule_123",
    "resource_id": "550e8400-e29b-41d4-a716-446655440000",
    "location_id": "loc_12345",
    "start_date": "2025-01-01"
  },
  "schedule_block": {
    "id": "block_456",
    "weekday": "monday",
    "start_time": "09:00:00",
    "end_time": "17:00:00"
  }
}
```

### 11. Get All Resource Schedule Blocks (Organized by Weekday)
**GET** `/getAllResourceScheduleBlocks/:resource_name`

**Description:** Get resource with all schedule blocks organized by weekday

**Parameters:**
- `resource_name` (path parameter): Name of the resource

**Example:**
```
GET /getAllResourceScheduleBlocks/Conference%20Room%20A
```

**Response:**
```json
{
  "resource": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Conference Room A"
  },
  "recurring_schedule": {
    "id": "schedule_123",
    "resource_id": "550e8400-e29b-41d4-a716-446655440000"
  },
  "schedule_blocks_by_weekday": {
    "monday": {
      "id": "block_456",
      "weekday": "monday",
      "start_time": "09:00:00",
      "end_time": "17:00:00"
    },
    "tuesday": {
      "id": "block_789",
      "weekday": "tuesday", 
      "start_time": "09:00:00",
      "end_time": "17:00:00"
    },
    "wednesday": null,
    "thursday": null,
    "friday": null,
    "saturday": null,
    "sunday": null
  }
}
```

### 12. Get Resource Weekly Schedule (Alternative)
**GET** `/getResourceWeeklySchedule/:resource_name`

**Description:** Alternative endpoint name for getting weekly schedule (same as getAllResourceScheduleBlocks)

**Parameters:**
- `resource_name` (path parameter): Name of the resource

**Response:** Same as `/getAllResourceScheduleBlocks/:resource_name`

### 13. Get Schedule Block ID by Resource Name and Weekday
**GET** `/getScheduleBlockId/:resource_name/:weekday`

**Description:** Get just the schedule block ID for a specific resource and weekday

**Parameters:**
- `resource_name` (path parameter): Name of the resource
- `weekday` (path parameter): Day of the week

**Example:**
```
GET /getScheduleBlockId/Conference%20Room%20A/monday
```

**Response:**
```json
{
  "resource_name": "Conference Room A",
  "weekday": "monday",
  "schedule_block_id": "block_456"
}
```

### 14. Get Schedule Block by Resource Name and Weekday (Full Context)
**GET** `/getScheduleBlock/:resource_name/:weekday`

**Description:** Get schedule block with full resource and recurring schedule context

**Parameters:**
- `resource_name` (path parameter): Name of the resource
- `weekday` (path parameter): Day of the week

**Example:**
```
GET /getScheduleBlock/Conference%20Room%20A/monday
```

**Response:**
```json
{
  "resource": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Conference Room A"
  },
  "recurring_schedule": {
    "id": "schedule_123",
    "resource_id": "550e8400-e29b-41d4-a716-446655440000"
  },
  "schedule_block": {
    "id": "block_456",
    "recurring_schedule_id": "schedule_123",
    "weekday": "monday",
    "start_time": "09:00:00",
    "end_time": "17:00:00",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
}
```

### 15. Get Schedule Block Details Only
**GET** `/getScheduleBlockOnly/:resource_name/:weekday`

**Description:** Get only the schedule block details without additional context

**Parameters:**
- `resource_name` (path parameter): Name of the resource
- `weekday` (path parameter): Day of the week

**Example:**
```
GET /getScheduleBlockOnly/Conference%20Room%20A/monday
```

**Response:**
```json
{
  "id": "block_456",
  "recurring_schedule_id": "schedule_123",
  "weekday": "monday",
  "start_time": "09:00:00",
  "end_time": "17:00:00",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

### 16. Update Schedule Block
**PATCH** `/updateScheduleBlock/:resource_name/:weekday`

**Description:** Update schedule block times for a specific resource and weekday

**Parameters:**
- `resource_name` (path parameter): Name of the resource
- `weekday` (path parameter): Day of the week

**Request Body:**
```json
{
  "start_time": "10:00:00",
  "end_time": "18:00:00"
}
```

**Example:**
```
PATCH /updateScheduleBlock/Conference%20Room%20A/monday
```

**Response:**
```json
{
  "message": "Schedule block updated successfully",
  "data": {
    "id": "block_456",
    "weekday": "monday",
    "start_time": "10:00:00",
    "end_time": "18:00:00"
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 422 Unprocessable Entity
```json
{
  "error": "Rate validation failed: Rate 1: price_name is required and must be a string"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Detailed error message"
}
```

---

## Rate Types Reference

When creating resources with rates, use these `renewal_type` values:

- `"every month"` - Monthly billing cycle
- `"every week"` - Weekly billing cycle  
- `"every day"` - Daily billing cycle
- `"every hour"` - Hourly billing cycle
- `"every use"` - Per-use billing (one-time charge)

---

## Weekday Values

For all weekday parameters, use lowercase values:
- `monday`
- `tuesday`
- `wednesday`
- `thursday`
- `friday`
- `saturday`
- `sunday`

---

## Time Format

All time values should be in 24-hour format: `HH:MM:SS`
- Example: `"09:00:00"` for 9:00 AM
- Example: `"17:30:00"` for 5:30 PM

## Date Format

All date values should be in ISO format: `YYYY-MM-DD`
- Example: `"2025-01-01"` for January 1st, 2025