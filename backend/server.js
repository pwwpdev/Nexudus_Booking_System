import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const HAPIO_BASE = "https://eu-central-1.hapio.net/v1";
const HAPIO_KEY = process.env.HAPIO_KEY;

// ---- Centralized Hapio request wrapper ----
async function hapioRequest(path, method = "GET", body = null) {
    const url = `${HAPIO_BASE}${path}`;
    try {
        const response = await axios({
            url,
            method,
            headers: {
                Authorization: `Bearer ${HAPIO_KEY}`,
                "Content-Type": "application/json",
            },
            data: body,
        });
        return response.data;
    } catch (err) {
        console.error("Hapio API Error:", err.response?.data || err.message);
        const error = new Error(err.response?.data?.message || err.message);
        error.status = err.response?.status || 500;
        error.details = err.response?.data?.errors || null;
        throw error;
    }
}

// Utility: remove empty/null fields
function cleanBody(obj) {
    const body = {};
    Object.keys(obj || {}).forEach((key) => {
        if (obj[key] !== undefined && obj[key] !== "" && obj[key] !== null) {
            body[key] = obj[key];
        }
    });
    return body;
}

// Utility: send error response safely
function sendError(res, err) {
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        errors: err.details || null,
    });
}

/* -----------------------
   LOCATIONS CRUD
----------------------- */
app.post("/create-location", async (req, res) => {
    try {
        const { name, time_zone } = req.body;
        if (!name || !time_zone) {
            return res.status(400).json({ error: "Name & Time Zone required" });
        }

        const existing = await hapioRequest("/locations", "GET");
        if (existing?.data?.some((l) => l.name.toLowerCase() === name.toLowerCase())) {
            return res.status(400).json({ error: `Location "${name}" already exists` });
        }

        const response = await hapioRequest("/locations", "POST", {
            name,
            time_zone,
            resource_selection_strategy: "equalize",
        });
        res.json(response);
    } catch (err) {
        sendError(res, err);
    }
});

app.get("/all-locations", async (req, res) => {
    try {
        res.json(await hapioRequest("/locations", "GET"));
    } catch (err) {
        sendError(res, err);
    }
});

app.patch("/update-location/:id", async (req, res) => {
    try {
        res.json(await hapioRequest(`/locations/${req.params.id}`, "PATCH", cleanBody(req.body)));
    } catch (err) {
        sendError(res, err);
    }
});

app.delete("/delete-location/:id", async (req, res) => {
    try {
        res.json(await hapioRequest(`/locations/${req.params.id}`, "DELETE"));
    } catch (err) {
        sendError(res, err);
    }
});

/* -----------------------
   RESOURCES CRUD
----------------------- */
app.post("/create-resource", async (req, res) => {
    try {
        const { name, max_simultaneous_bookings } = req.body;
        if (!name || !max_simultaneous_bookings)
            return res.status(400).json({ error: "Name & Max bookings required" });

        const existing = await hapioRequest("/resources", "GET");
        if (existing?.data?.some((r) => r.name.toLowerCase() === name.toLowerCase())) {
            return res.status(400).json({ error: `Resource "${name}" already exists` });
        }

        res.json(await hapioRequest("/resources", "POST", { name, max_simultaneous_bookings }));
    } catch (err) {
        sendError(res, err);
    }
});

app.get("/all-resources", async (req, res) => {
    try {
        res.json(await hapioRequest("/resources", "GET"));
    } catch (err) {
        sendError(res, err);
    }
});

app.patch("/update-resource/:id", async (req, res) => {
    try {
        res.json(await hapioRequest(`/resources/${req.params.id}`, "PATCH", cleanBody(req.body)));
    } catch (err) {
        sendError(res, err);
    }
});

app.delete("/delete-resource/:id", async (req, res) => {
    try {
        res.json(await hapioRequest(`/resources/${req.params.id}`, "DELETE"));
    } catch (err) {
        sendError(res, err);
    }
});

/* -----------------------
   SERVICES CRUD
----------------------- */
app.post("/create-service", async (req, res) => {
    try {
        const { name, price, duration, bookable_interval } = req.body;
        if (!name || !price || !duration) {
            return res.status(400).json({ error: "Name, Price, Duration required" });
        }

        const existing = await hapioRequest("/services", "GET");
        if (existing?.data?.some(s => s.name.toLowerCase() === name.toLowerCase())) {
            return res.status(400).json({ error: `Service "${name}" already exists` });
        }

        const body = { name, price, duration, type: "fixed" };
        if (bookable_interval) body.bookable_interval = bookable_interval;

        const response = await hapioRequest("/services", "POST", body);
        res.json(response);
    } catch (err) {
        res.status(err.status || 500).json(err);
    }
});

app.get("/all-services", async (req, res) => {
    try {
        const response = await hapioRequest("/services", "GET");
        res.json(response);
    } catch (err) {
        res.status(err.status || 500).json(err);
    }
});

app.patch("/update-service/:id", async (req, res) => {
    try {
        const body = cleanBody(req.body);
        const response = await hapioRequest(`/services/${req.params.id}`, "PATCH", body);
        res.json(response);
    } catch (err) {
        res.status(err.status || 500).json(err);
    }
});

app.delete("/delete-service/:id", async (req, res) => {
    try {
        const response = await hapioRequest(`/services/${req.params.id}`, "DELETE");
        res.json(response);
    } catch (err) {
        res.status(err.status || 500).json(err);
    }
});


/* -----------------------
   ASSOCIATIONS
----------------------- */
app.put("/associate-service/:serviceId/resource/:resourceId", async (req, res) => {
    try {
        res.json(await hapioRequest(`/services/${req.params.serviceId}/resources/${req.params.resourceId}`, "PUT"));
    } catch (err) {
        sendError(res, err);
    }
});

app.delete("/associate-service/:serviceId/resource/:resourceId", async (req, res) => {
    try {
        res.json(await hapioRequest(`/services/${req.params.serviceId}/resources/${req.params.resourceId}`, "DELETE"));
    } catch (err) {
        sendError(res, err);
    }
});

app.get("/associations/:serviceId", async (req, res) => {
    try {
        const resources = await hapioRequest("/resources", "GET");
        const results = [];

        if (resources?.data) {
            for (const r of resources.data) {
                try {
                    const assoc = await hapioRequest(`/services/${req.params.serviceId}/resources/${r.id}`, "GET");
                    if (assoc && assoc.resource_id === r.id) {
                        results.push({ resource: r, association: assoc });
                    }
                } catch {
                    // skip unassociated resources
                }
            }
        }

        res.json({ service_id: req.params.serviceId, associations: results });
    } catch (err) {
        sendError(res, err);
    }
});

/* -----------------------
   SCHEDULE BLOCKS CRUD
----------------------- */
app.post("/resource/:resId/schedule-blocks", async (req, res) => {
    try {
        res.json(await hapioRequest(`/resources/${req.params.resId}/schedule-blocks`, "POST", cleanBody(req.body)));
    } catch (err) {
        sendError(res, err);
    }
});

app.get("/resource/:resId/schedule-blocks", async (req, res) => {
    try {
        res.json(await hapioRequest(`/resources/${req.params.resId}/schedule-blocks`, "GET"));
    } catch (err) {
        sendError(res, err);
    }
});

app.patch("/resource/:resId/schedule-blocks/:blockId", async (req, res) => {
    try {
        res.json(await hapioRequest(`/resources/${req.params.resId}/schedule-blocks/${req.params.blockId}`, "PATCH", cleanBody(req.body)));
    } catch (err) {
        sendError(res, err);
    }
});

app.delete("/resource/:resId/schedule-blocks/:blockId", async (req, res) => {
    try {
        res.json(await hapioRequest(`/resources/${req.params.resId}/schedule-blocks/${req.params.blockId}`, "DELETE"));
    } catch (err) {
        sendError(res, err);
    }
});

/* -----------------------
   RECURRING SCHEDULES CRUD
----------------------- */
app.post("/resource/:resId/recurring-schedules", async (req, res) => {
    try {
        res.json(await hapioRequest(`/resources/${req.params.resId}/recurring-schedules`, "POST", cleanBody(req.body)));
    } catch (err) {
        sendError(res, err);
    }
});

app.get("/resource/:resId/recurring-schedules", async (req, res) => {
    try {
        res.json(await hapioRequest(`/resources/${req.params.resId}/recurring-schedules`, "GET"));
    } catch (err) {
        sendError(res, err);
    }
});

app.patch("/resource/:resId/recurring-schedules/:schedId", async (req, res) => {
    try {
        res.json(await hapioRequest(`/resources/${req.params.resId}/recurring-schedules/${req.params.schedId}`, "PATCH", cleanBody(req.body)));
    } catch (err) {
        sendError(res, err);
    }
});

app.delete("/resource/:resId/recurring-schedules/:schedId", async (req, res) => {
    try {
        res.json(await hapioRequest(`/resources/${req.params.resId}/recurring-schedules/${req.params.schedId}`, "DELETE"));
    } catch (err) {
        sendError(res, err);
    }
});

/* -----------------------
   BOOKINGS CRUD
----------------------- */
app.post("/create-booking", async (req, res) => {
    try {
        const { location_id, resource_id, service_id, starts_at, ends_at } = req.body;
        if (!location_id || !resource_id || !service_id || !starts_at || !ends_at) {
            return res.status(400).json({ error: "All fields required" });
        }
        res.json(await hapioRequest("/bookings", "POST", cleanBody(req.body)));
    } catch (err) {
        sendError(res, err);
    }
});

app.get("/all-bookings", async (req, res) => {
    try {
        res.json(await hapioRequest("/bookings", "GET"));
    } catch (err) {
        sendError(res, err);
    }
});

app.patch("/update-booking/:id", async (req, res) => {
    try {
        res.json(await hapioRequest(`/bookings/${req.params.id}`, "PATCH", cleanBody(req.body)));
    } catch (err) {
        sendError(res, err);
    }
});

app.delete("/delete-booking/:id", async (req, res) => {
    try {
        res.json(await hapioRequest(`/bookings/${req.params.id}`, "DELETE"));
    } catch (err) {
        sendError(res, err);
    }
});

/* -----------------------
   START SERVER
----------------------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
