import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const HAPIO_BASE = "https://eu-central-1.hapio.net/v1";
const API_KEY = process.env.HAPIO_API_KEY;

export async function hapioRequest(path, method = "GET", data = null) {
    try {
        const res = await axios({
            url: `${HAPIO_BASE}${path}`,
            method,
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            data
        });
        return res.data;
    } catch (err) {
        return { error: err.response?.data || err.message };
    }
}
