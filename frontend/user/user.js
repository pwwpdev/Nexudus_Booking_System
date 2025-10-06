document.addEventListener("DOMContentLoaded", async () => {
    await populateResources();
});

async function populateResources() {
    const res = await apiRequest("/all-resources");
    const select = document.getElementById("uResourceId");
    select.innerHTML = "";

    if (Array.isArray(res.data) && res.data.length > 0) {
        res.data.forEach(r => {
            const opt = document.createElement("option");
            opt.value = r.id;
            opt.textContent = `${r.name} (ID: ${r.id})`;
            select.appendChild(opt);
        });
        await populateServicesForResource();
    }
}

async function populateServicesForResource() {
    const resourceId = document.getElementById("uResourceId").value;
    const serviceSelect = document.getElementById("uServiceId");
    serviceSelect.innerHTML = "";

    if (!resourceId) return;

    const servicesRes = await apiRequest("/all-services");
    if (Array.isArray(servicesRes.data)) {
        for (const srv of servicesRes.data) {
            const assoc = await apiRequest(`/association/${srv.id}/resource/${resourceId}`, "GET");
            if (assoc && assoc.resource_id === resourceId) {
                const opt = document.createElement("option");
                opt.value = srv.id;
                opt.textContent = `${srv.name} (ID: ${srv.id})`;
                serviceSelect.appendChild(opt);
            }
        }
    }

    if (!serviceSelect.options.length) {
        const opt = document.createElement("option");
        opt.textContent = "No services for this resource";
        serviceSelect.appendChild(opt);
    }
}

async function userBook() {
    const body = {
        location_id: "your-default-location-id", // replace with actual
        resource_id: document.getElementById("uResourceId").value,
        service_id: document.getElementById("uServiceId").value,
        starts_at: document.getElementById("uStart").value,
        ends_at: document.getElementById("uEnd").value
    };

    if (!body.resource_id || !body.service_id || !body.starts_at || !body.ends_at) {
        document.getElementById("userBookResult").textContent = JSON.stringify({ error: "All fields required" }, null, 2);
        return;
    }
    if (new Date(body.starts_at) >= new Date(body.ends_at)) {
        document.getElementById("userBookResult").textContent = JSON.stringify({ error: "Start must be before end" }, null, 2);
        return;
    }

    const res = await apiRequest("/create-booking", "POST", body);
    document.getElementById("userBookResult").textContent = JSON.stringify(res, null, 2);
}

async function userListResources() {
    const res = await apiRequest("/all-resources");
    document.getElementById("userResResult").textContent = JSON.stringify(res, null, 2);
}
async function userListServices() {
    const res = await apiRequest("/all-services");
    document.getElementById("userSrvResult").textContent = JSON.stringify(res, null, 2);
}
