const API_BASE = "http://localhost:4000"; // backend
async function apiRequest(path, method = "GET", body = null) {
    const res = await fetch(API_BASE + path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : null,
    });
    return res.json();
}
