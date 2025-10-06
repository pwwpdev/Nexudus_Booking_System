// ---------- LOCATIONS ----------
async function createLocation() {
    const name = document.getElementById('locName').value;
    const time_zone = document.getElementById('locTZ').value;
    output('locOutput', await apiRequest('/create-location', 'POST', { name, time_zone }));
}
async function listLocations() {
    output('locOutput', await apiRequest('/all-locations'));
}
async function updateLocation() {
    const id = document.getElementById('locUpdateId').value;
    const name = document.getElementById('locNewName').value;
    const time_zone = document.getElementById('locNewTZ').value;
    output('locOutput', await apiRequest(`/update-location/${id}`, 'PATCH', { name, time_zone }));
}
async function deleteLocation() {
    const id = document.getElementById('locDeleteId').value;
    output('locOutput', await apiRequest(`/delete-location/${id}`, 'DELETE'));
}

// ---------- RESOURCES ----------
async function createResource() {
    const name = document.getElementById('resName').value;
    const max_simultaneous_bookings = parseInt(document.getElementById('resMax').value);
    output('resOutput', await apiRequest('/create-resource', 'POST', { name, max_simultaneous_bookings }));
}
async function listResources() {
    output('resOutput', await apiRequest('/all-resources'));
}
async function updateResource() {
    const id = document.getElementById('resUpdateId').value;
    const name = document.getElementById('resNewName').value;
    const max_simultaneous_bookings = parseInt(document.getElementById('resNewMax').value);
    output('resOutput', await apiRequest(`/update-resource/${id}`, 'PATCH', { name, max_simultaneous_bookings }));
}
async function deleteResource() {
    const id = document.getElementById('resDeleteId').value;
    output('resOutput', await apiRequest(`/delete-resource/${id}`, 'DELETE'));
}

// ---------- SERVICES ----------
async function createService() {
    const name = document.getElementById('srvName').value;
    const price = document.getElementById('srvPrice').value;
    const duration = document.getElementById('srvDuration').value;
    const bookable_interval = document.getElementById('srvBookable').value;

    const body = { name, price, duration };
    if (bookable_interval) body.bookable_interval = bookable_interval;

    output('srvOutput', await apiRequest('/create-service', 'POST', body));
}

async function listServices() {
    const response = await apiRequest('/all-services');
    // Pretty print with bookable_interval
    if (response?.data) {
        const formatted = response.data.map(s => ({
            id: s.id,
            name: s.name,
            price: s.price,
            duration: s.duration,
            bookable_interval: s.bookable_interval || "default (duration + buffers)"
        }));
        output('srvOutput', formatted);
    } else {
        output('srvOutput', response);
    }
}

async function updateService() {
    const id = document.getElementById('srvUpdateId').value;
    const name = document.getElementById('srvNewName').value;
    const price = document.getElementById('srvNewPrice').value;
    const duration = document.getElementById('srvNewDuration').value;
    const bookable_interval = document.getElementById('srvNewBookable').value;

    const body = {};
    if (name) body.name = name;
    if (price) body.price = price;
    if (duration) body.duration = duration;
    if (bookable_interval) body.bookable_interval = bookable_interval;

    output('srvOutput', await apiRequest(`/update-service/${id}`, 'PATCH', body));
}

async function deleteService() {
    const id = document.getElementById('srvDeleteId').value;
    output('srvOutput', await apiRequest(`/delete-service/${id}`, 'DELETE'));
}


// ---------- ASSOCIATIONS ----------
async function associateServiceToResource() {
    const serviceId = document.getElementById('assocSrvId').value;
    const resourceId = document.getElementById('assocResId').value;
    output('assocResSrvOutput', await apiRequest(`/associate-service/${serviceId}/resource/${resourceId}`, 'PUT'));
}
async function removeServiceFromResource() {
    const serviceId = document.getElementById('assocSrvIdRemove').value;
    const resourceId = document.getElementById('assocResIdRemove').value;
    output('assocResSrvOutput', await apiRequest(`/associate-service/${serviceId}/resource/${resourceId}`, 'DELETE'));
}
async function listAssociations() {
    const serviceId = document.getElementById("assocSrvId").value;
    output("assocResSrvOutput", await apiRequest(`/associations/${serviceId}`, "GET"));
}

// ---------- SCHEDULE BLOCKS ----------
async function createScheduleBlock() {
    const resId = document.getElementById('sbResId').value;
    const body = {
        location_id: document.getElementById('sbLocId').value,
        starts_at: document.getElementById('sbStart').value,
        ends_at: document.getElementById('sbEnd').value
    };
    output('sbOutput', await apiRequest(`/resource/${resId}/schedule-blocks`, 'POST', body));
}
async function listScheduleBlocks() {
    const resId = document.getElementById('sbResId').value;
    output('sbOutput', await apiRequest(`/resource/${resId}/schedule-blocks`));
}
async function updateScheduleBlock() {
    const resourceId = document.getElementById('sbUpdateResId').value;
    const blockId = document.getElementById('sbUpdateId').value;
    const starts_at = document.getElementById('sbUpdateStart').value;
    const ends_at = document.getElementById('sbUpdateEnd').value;

    const body = {};
    if (starts_at) body.starts_at = starts_at;
    if (ends_at) body.ends_at = ends_at;

    output('sbOutput', await apiRequest(`/resource/${resourceId}/schedule-blocks/${blockId}`, 'PATCH', body));
}
async function deleteScheduleBlock() {
    const resId = document.getElementById('sbDeleteResId').value;
    const blockId = document.getElementById('sbDeleteId').value;
    output('sbOutput', await apiRequest(`/resource/${resId}/schedule-blocks/${blockId}`, 'DELETE'));
}

// ---------- RECURRING SCHEDULES ----------
async function createRecurringSchedule() {
    const resId = document.getElementById('rsResId').value;
    const body = {
        location_id: document.getElementById('rsLocId').value,
        start_date: document.getElementById('rsStartDate').value,
        end_date: document.getElementById('rsEndDate').value,
        interval: parseInt(document.getElementById('rsInterval').value)
    };
    output('rsOutput', await apiRequest(`/resource/${resId}/recurring-schedules`, 'POST', body));
}
async function listRecurringSchedules() {
    const resId = document.getElementById('rsResId').value;
    output('rsOutput', await apiRequest(`/resource/${resId}/recurring-schedules`));
}
async function updateRecurringSchedule() {
    const resId = document.getElementById('rsUpdateResId').value;
    const schedId = document.getElementById('rsUpdateId').value;
    const location_id = document.getElementById('rsUpdateLocId').value;
    const start_date = document.getElementById('rsUpdateStartDate').value;
    const end_date = document.getElementById('rsUpdateEndDate').value;
    const interval = document.getElementById('rsUpdateInterval').value;

    const body = {};
    if (location_id) body.location_id = location_id;
    if (start_date) body.start_date = start_date;
    if (end_date) body.end_date = end_date;
    if (interval) body.interval = parseInt(interval);

    output('rsOutput', await apiRequest(`/resource/${resId}/recurring-schedules/${schedId}`, 'PATCH', body));
}

async function deleteRecurringSchedule() {
    const resId = document.getElementById('rsDeleteResId').value;
    const schedId = document.getElementById('rsDeleteId').value;
    output('rsOutput', await apiRequest(`/resource/${resId}/recurring-schedules/${schedId}`, 'DELETE'));
}

// ---------- BOOKINGS ----------
async function createBooking() {
    const body = {
        location_id: document.getElementById('bookLoc').value,
        resource_id: document.getElementById('bookRes').value,
        service_id: document.getElementById('bookSrv').value,
        starts_at: document.getElementById('bookStart').value,
        ends_at: document.getElementById('bookEnd').value
    };
    output('bookOutput', await apiRequest('/create-booking', 'POST', body));
}
async function listBookings() {
    output('bookOutput', await apiRequest('/all-bookings'));
}
async function updateBooking() {
    const id = document.getElementById('bookUpdateId').value;
    const location_id = document.getElementById('bookUpdateLoc').value;
    const resource_id = document.getElementById('bookUpdateRes').value;
    const service_id = document.getElementById('bookUpdateSrv').value;
    const starts_at = document.getElementById('bookUpdateStart').value;
    const ends_at = document.getElementById('bookUpdateEnd').value;

    const body = {};
    if (location_id) body.location_id = location_id;
    if (resource_id) body.resource_id = resource_id;
    if (service_id) body.service_id = service_id;
    if (starts_at) body.starts_at = starts_at;
    if (ends_at) body.ends_at = ends_at;

    output('bookOutput', await apiRequest(`/update-booking/${id}`, 'PATCH', body));
}

async function deleteBooking() {
    const id = document.getElementById('bookDeleteId').value;
    output('bookOutput', await apiRequest(`/delete-booking/${id}`, 'DELETE'));
}

// ---------- Helper ----------
function output(el, data) {
    document.getElementById(el).textContent = JSON.stringify(data, null, 2);
}

