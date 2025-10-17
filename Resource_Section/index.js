const express = require("express");
const cors = require("cors"); // Import cors package

// Add process error handlers to prevent server crashes
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    console.error('Stack:', error.stack);
    // Don't exit the process, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit the process, just log the error
});

process.on('SIGINT', () => {
    console.log('\nReceived SIGINT. Graceful shutdown...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM. Graceful shutdown...');
    process.exit(0);
});
const { Limitations } = require("./Limitations/createLimitationResouce");
const { createResource } = require("./Controllers/Resource/createResource");
const { viewResource } = require("./Controllers/Resource/viewResource");
const { viewAllresources } = require("./Controllers/Resource/viewAllresources");
const { deleteResource } = require("./Controllers/Resource/deleteResource");
const { getResourceByName } = require("./Controllers/Resource/getResourceByName");
const { getRecurringScheduleByResource } = require("./Controllers/RecurringSchedule/getRecurringScheduleByResource");
const { getScheduleBlockByWeekday } = require("./Controllers/RecurringSchedule/getScheduleBlockByWeekday");
const { getResourceScheduleInfo, getAllResourceScheduleBlocks, getResourceWeeklySchedule } = require("./Controllers/Resource/getResourceScheduleInfo");
const { getScheduleBlocksByWeekday } = require("./Controllers/RecurringSchedule/getScheduleBlocksByWeekday");
const { getScheduleBlockIdByResourcename } = require("./Controllers/RecurringSchedule/getScheduleBlockIdByResourcename");
const { updateRecurringScheduleBlock, updateRecurringScheduleBlockOptimized } = require("./update/updateRecurringScheduleBlock");
const app = express();

// Enable CORS for all routes
app.use(cors());

// Or configure CORS with specific options
app.use(cors({
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '10mb' })); // Increase JSON payload limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request timeout middleware
app.use((req, res, next) => {
    // Set timeout for all requests (30 seconds)
    req.setTimeout(30000, () => {
        console.log('Request timeout for:', req.method, req.url);
        if (!res.headersSent) {
            res.status(408).json({ error: 'Request timeout' });
        }
    });
    next();
});

// Add global error handler middleware
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    if (!res.headersSent) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        pid: process.pid
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'HAPIO API Server',
        version: '1.0.0',
        status: 'running'
    });
});

app.get('/viewAllresources', async (req, res) => {
    try {
        const resource = await viewAllresources();
        res.json(resource.data);
    }
    catch (err) {
        console.error('Error in viewAllresources:', err);
        res.status(500).send({ error: err.message });
    }
});

app.delete('/deleteResource/:resource_id', async (req, res) => {
    try {
        const { resource_id } = req.params;
        await deleteResource(resource_id);
        res.status(200).send({ message: "Resource deleted successfully" });
    } catch (error) {
        console.error("Error from deleting resource file :", error);
        res.status(500).send({ error: error.message });
    }
});

// View resource by name (returns full API response)
app.get('/viewResource/:resource_name', async (req, res) => {
    try {
        const { resource_name } = req.params;
        const resource = await viewResource(resource_name);
        res.status(200).json(resource.data);
    } catch (error) {
        console.error("Error viewing resource:", error);
        res.status(500).send({ error: error.message });
    }
});

// Get resource ID and details by name (returns processed resource object)
app.get('/getResourceByName/:resource_name', async (req, res) => {
    try {
        const { resource_name } = req.params;
        const resource = await getResourceByName(resource_name);
        res.status(200).json(resource);
    } catch (error) {
        console.error("Error getting resource by name:", error);
        res.status(500).send({ error: error.message });
    }
});

// Get recurring schedule by resource ID
app.get('/getRecurringSchedule/:resource_id', async (req, res) => {
    try {
        const { resource_id } = req.params;
        const recurringSchedule = await getRecurringScheduleByResource(resource_id);
        res.status(200).json(recurringSchedule);
    } catch (error) {
        console.error("Error getting recurring schedule:", error);
        res.status(500).send({ error: error.message });
    }
});

// Get schedule block by weekday
app.get('/getScheduleBlock/:resource_id/:recurring_schedule_id/:weekday', async (req, res) => {
    try {
        const { resource_id, recurring_schedule_id, weekday } = req.params;
        const scheduleBlock = await getScheduleBlockByWeekday(resource_id, recurring_schedule_id, weekday);
        res.status(200).json(scheduleBlock);
    } catch (error) {
        console.error("Error getting schedule block:", error);
        res.status(500).send({ error: error.message });
    }
});

// Get complete resource schedule info (resource + recurring schedule + optional weekday schedule block)
app.get('/getResourceScheduleInfo/:resource_name', async (req, res) => {
    try {
        const { resource_name } = req.params;
        const { weekday } = req.query; // Optional query parameter
        const scheduleInfo = await getResourceScheduleInfo(resource_name, weekday);
        res.status(200).json(scheduleInfo);
    } catch (error) {
        console.error("Error getting resource schedule info:", error);
        res.status(500).send({ error: error.message });
    }
});

// Get resource with all schedule blocks organized by weekday
app.get('/getAllResourceScheduleBlocks/:resource_name', async (req, res) => {
    try {
        const { resource_name } = req.params;
        const resourceSchedule = await getAllResourceScheduleBlocks(resource_name);
        res.status(200).json(resourceSchedule);
    } catch (error) {
        console.error("Error getting all resource schedule blocks:", error);
        res.status(500).send({ error: error.message });
    }
});

// Get resource weekly schedule (alternative endpoint with clearer name)
app.get('/getResourceWeeklySchedule/:resource_name', async (req, res) => {
    try {
        const { resource_name } = req.params;
        const weeklySchedule = await getResourceWeeklySchedule(resource_name);
        res.status(200).json(weeklySchedule);
    } catch (error) {
        console.error("Error getting resource weekly schedule:", error);
        res.status(500).send({ error: error.message });
    }
});

// Get schedule block ID by resource name and weekday
app.get('/getScheduleBlockId/:resource_name/:weekday', async (req, res) => {
    try {
        const { resource_name, weekday } = req.params;
        const scheduleBlockId = await getScheduleBlockIdByResourcename(resource_name, weekday);
        res.status(200).json({
            resource_name: resource_name,
            weekday: weekday,
            schedule_block_id: scheduleBlockId
        });
    } catch (error) {
        console.error("Error getting schedule block ID:", error);
        res.status(500).send({ error: error.message });
    }
});

// Update recurring schedule block by resource name and weekday
app.patch('/updateScheduleBlock/:resource_name/:weekday', async (req, res) => {
    try {
        const { resource_name, weekday } = req.params;
        const { start_time, end_time } = req.body;

        const response = await updateRecurringScheduleBlock(resource_name, weekday, start_time, end_time);
        res.status(200).json({
            message: "Schedule block updated successfully",
            data: response.data
        });
    } catch (error) {
        console.error("Error updating schedule block:", error);
        res.status(500).send({ error: error.message });
    }
});

// Get schedule block by resource name and weekday (with full context)
app.get('/getScheduleBlock/:resource_name/:weekday', async (req, res) => {
    try {
        const { resource_name, weekday } = req.params;
        const scheduleBlock = await getScheduleBlock(resource_name, weekday);
        res.status(200).json(scheduleBlock);
    } catch (error) {
        console.error("Error getting schedule block:", error);
        res.status(500).send({ error: error.message });
    }
});

// Get schedule block details only (without resource context)
app.get('/getScheduleBlockOnly/:resource_name/:weekday', async (req, res) => {
    try {
        const { resource_name, weekday } = req.params;
        const scheduleBlock = await getScheduleBlockOnly(resource_name, weekday);
        res.status(200).json(scheduleBlock);
    } catch (error) {
        console.error("Error getting schedule block details:", error);
        res.status(500).send({ error: error.message });
    }
});

app.post('/createResource', async (req, res) => {
    try {
        const {
            price,
            defined_timings,
            max_duration,
            min_duration,
            duration_interval,
            resource_details,
            email_confirmation,
            resource_name,
            start_date,
            startTime,
            endTime,
            capacity,
            resource_plans,
            category,
            location_id,
            metadata,
            photo_url,
            rates
        } = req.body;

        const resourceId = await Limitations({
            price,
            defined_timings,
            max_duration,
            min_duration,
            duration_interval,
            resource_name,
            resource_details,
            email_confirmation,
            start_date,
            startTime,
            endTime,
            capacity,
            resource_plans,
            category,
            location_id,
            metadata,
            photo_url,
            rates
        });

        res.status(200).send({ message: "Resource created successfully", resource_id: resourceId });
    } catch (error) {
        console.error("Error creating resource:", error);
        res.status(500).send({ error: error.message });
    }
});

const server = app.listen(3000, () => {
    console.log("Server is running on port 3000");
    console.log("Process ID:", process.pid);
    console.log("Node.js version:", process.version);
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
    if (error.code === 'EADDRINUSE') {
        console.error('Port 3000 is already in use');
        process.exit(1);
    }
});

// Graceful shutdown
const gracefulShutdown = () => {
    console.log('\nStarting graceful shutdown...');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);