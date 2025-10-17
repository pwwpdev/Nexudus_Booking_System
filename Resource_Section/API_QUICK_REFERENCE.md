# HAPIO API Quick Reference

## Base URL: `http://localhost:3000`

## Quick Endpoint List

### Health & Status
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/` | API info |

### Resource Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/createResource` | Create new resource with rates |
| GET | `/viewAllresources` | Get all resources |
| GET | `/viewResource/:name` | Get resource by name (full response) |
| GET | `/getResourceByName/:name` | Get resource by name (processed) |
| DELETE | `/deleteResource/:id` | Delete resource by ID |

### Schedule Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/getRecurringSchedule/:resource_id` | Get recurring schedule |
| GET | `/getResourceScheduleInfo/:name` | Complete resource + schedule info |
| GET | `/getAllResourceScheduleBlocks/:name` | All schedule blocks by weekday |
| GET | `/getResourceWeeklySchedule/:name` | Same as above (alternative name) |
| GET | `/getScheduleBlockId/:name/:weekday` | Get schedule block ID only |
| GET | `/getScheduleBlock/:name/:weekday` | Get schedule block with context |
| GET | `/getScheduleBlockOnly/:name/:weekday` | Get schedule block details only |
| PATCH | `/updateScheduleBlock/:name/:weekday` | Update schedule block times |

## Common Examples

### Create Resource with Rates
```bash
curl -X POST http://localhost:3000/createResource \
  -H "Content-Type: application/json" \
  -d '{
    "resource_name": "Meeting Room 1",
    "defined_timings": [{"weekday": "monday", "start_time": "09:00:00", "end_time": "17:00:00"}],
    "max_duration": 120,
    "min_duration": 30,
    "duration_interval": 15,
    "start_date": "2025-01-01",
    "capacity": 8,
    "category": "meeting_room",
    "rates": [
      {
        "price_name": "Hourly Rate",
        "description": "Standard hourly rate",
        "price": 50,
        "renewal_type": "every hour"
      }
    ]
  }'
```

### Get Resource Schedule
```bash
curl http://localhost:3000/getResourceScheduleInfo/Meeting%20Room%201?weekday=monday
```

### Update Schedule Block
```bash
curl -X PATCH http://localhost:3000/updateScheduleBlock/Meeting%20Room%201/monday \
  -H "Content-Type: application/json" \
  -d '{"start_time": "10:00:00", "end_time": "18:00:00"}'
```

### Get Weekly Schedule
```bash
curl http://localhost:3000/getAllResourceScheduleBlocks/Meeting%20Room%201
```

## Rate Types
- `"every hour"` - Hourly billing
- `"every day"` - Daily billing  
- `"every week"` - Weekly billing
- `"every month"` - Monthly billing
- `"every use"` - Per-use billing

## Weekdays
`monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`

## Time Format
24-hour format: `HH:MM:SS` (e.g., `"09:00:00"`, `"17:30:00"`)

## Date Format  
ISO format: `YYYY-MM-DD` (e.g., `"2025-01-01"`)